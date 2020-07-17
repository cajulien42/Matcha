import React, { Component } from 'react';
import io from 'socket.io-client';

import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';
import HomeDumb from './HomeD';
import distance from '../Geolocalisation/distance';

const _ = require('lodash');
const mySocket = io('http://localhost:5000');

class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			suggestions: null,
			usersOnline: null,
			displayInput: {display: 'none'},
			currentLocation: null
		}
	}

	static contextType = UserContext;

	_isMounted = false;

	componentDidMount () {
		this._isMounted = true;

		if (this._isMounted) {
			this.getLocation
				.promise
				// .then(() => console.log('resolved'))
				.catch((reason) => console.log('isCanceled', reason.isCanceled));
			if (this.context.JWT.data.complete === "true") {
				mySocket.on('notification', notification => {
					if (notification.type === 'isOnline') {
						let onlineUsers = [{ howMany: 0 }];
						for (let i = 0; i < notification.result.length; i++) {
							if (notification.result[i].isOnline === true) {
								onlineUsers[0].howMany += 1;
								onlineUsers[notification.result[i].username] = true;
							}
						}
						this.setState({ usersOnline: onlineUsers });
					}
				});
			}
		}
	}

	/* Make sure that the infos such as "username liked you" displayed on their profil are updated immediately */
	componentDidUpdate () {
		if (this.context.newNotif.new === true) {
			// console.log("new notif in localStorage detected in HOMES");
			this.getSuggestions();
		}
	}

	makeCancelable = (promise) => {
		let hasCanceled_ = false;
	
		const wrappedPromise = new Promise((resolve, reject) => {
			promise.then((val) =>
				hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
		  	);
		  	promise.catch((error) =>
				hasCanceled_ ? reject({isCanceled: true}) : reject(error)
		  	);
		});

		return {
			promise: wrappedPromise,
			cancel() {
				hasCanceled_ = true;
			},
		};
	};
	
	tmp = new Promise((resolve, reject) => {
			if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(pos => {
					const coords = pos.coords;
					this.setState({
						currentLocation: {
							denied: false,
							lat: coords.latitude,
							lng: coords.longitude
						}
					}, function () {
						axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, { lat: coords.latitude, lon: coords.longitude} , {headers: {"x-auth-token": this.context.JWT.token}})
							.then((res) => {
								this.context.toggleUser(res.data.payload.result.token);
							})
							.catch((err) => console.log(err))
						axios.get(`http://localhost:4000/API/locate/reverseGeocode/${coords.latitude}/${coords.longitude}`)
							.then((res) => {
								const datas = res.data.payload.adress.address;
								const currentCoords = this.state.currentLocation;
								currentCoords['adress'] = datas.road;
								currentCoords['city'] = datas.village;
								currentCoords['state'] = datas.state;
								currentCoords['postcode'] = datas.postcode;
								currentCoords['country'] = datas.country;
								this.setState({ currentLocation: currentCoords }, function() {
									// console.log(this.state.currentLocation); 
									this.getSuggestions();
									resolve();
								});
							})
							.catch((err) => console.log(err))
					});
				},
				error => {
					if (error.code === error.PERMISSION_DENIED) {
					console.log('geoloc denied');
					axios.get('http://localhost:4000/API/locate/geocode')
						.then((position) => {
							this.setState({
								currentLocation: {
									denied: true,
									lat: position.data.payload.localisation.latitude,
									lng: position.data.payload.localisation.longitude
								}
							}, function () {
								console.log(position.data.payload.localisation.latitude);
								console.log(position.data.payload.localisation.longitude);
								axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, { lat: position.data.payload.localisation.latitude, lon: position.data.payload.localisation.longitude} , {headers: {"x-auth-token": this.context.JWT.token}})
									.then((res) => {
										this.context.toggleUser(res.data.payload.result.token);
									})
									.catch((err) => console.log(err))
								axios.get(`http://localhost:4000/API/locate/reverseGeocode/${position.data.payload.localisation.latitude}/${position.data.payload.localisation.longitude}`)
									.then((res) => {
										console.log(res);
										const datas = res.data.payload.adress.address;
										const currentCoords = this.state.currentLocation;
										currentCoords['adress'] = datas.road;
										currentCoords['city'] = datas.village;
										currentCoords['state'] = datas.state;
										currentCoords['postcode'] = datas.postcode;
										currentCoords['country'] = datas.country;
										this.setState({ currentLocation: currentCoords }, function() {
											console.log(this.state.currentLocation); 
											this.getSuggestions();
											resolve();
										});
									})
									.catch((err) => console.log(err))
							});
						})
					}
				})
			}
	});

	getLocation = this.makeCancelable(this.tmp) 

	getSuggestions = () => {
    	const { username } = this.context.JWT.data;
    	const { token } = this.context.JWT;

		if (username !== undefined && this.context.JWT.data.complete === "true") {
			axios.get(`http://localhost:4000/API/users/suggestions/${username}`, {headers: {"x-auth-token": token}})
				.then(response => {
					let suggestions = response.data.payload.result;
					suggestions.map((elem, i) => {
						if (this.state.currentLocation) {
							const toCompute = {
								user1: {lat: this.state.currentLocation.lat, lon: this.state.currentLocation.lng}, 
								user2: {lat: elem.user.lat, lon: elem.user.lon}
							};
							const ret = distance(toCompute.user1, toCompute.user2);
							elem.user['distance'] = ret;
							// console.log(ret);
							suggestions[i] = elem;
						}
						return (suggestions);
					})
					this.filterByDistance(suggestions);
				})
				.catch(err => { 
					console.log(err);
				})
		}
	}

	filterByDistance = (suggestions) => {
		if (this.state.currentLocation && suggestions.length > 0) {
				let sortedArray = [];
				let j = 0;
				suggestions.map((elem) => {
					if (elem.user.distance <= this.context.JWT.data.localisation) {
						return (sortedArray[j++] = elem);
					}
					else return null;
				});
				sortedArray = _.orderBy(sortedArray, ['user.distance'], ['asc']);
				this.setState({ suggestions: sortedArray });
		}
	}

	popupUser = (e, id) => {
		e.preventDefault();
		const users = document.querySelectorAll('.back');
		const underDiv = document.querySelectorAll('.underDiv');
		users[id].style.display = "flex";
		underDiv[id].style.display = "flex";
		document.getElementById("main").style.filter = 'blur(3px)';
		console.log("likedU: " + this.state.suggestions[id].user.likedU);
		console.log("Uliked: " + this.state.suggestions[id].user.Uliked);

		/* Creates a visit notification to receiver */
		const mySocket = io('http://localhost:5000');
		mySocket.emit('notification', {
			type: 'visit',
			emitter: this.context.JWT.data.username,
			receiver: this.state.suggestions[id].user.username,
		})

		const newNotification = {
			emitter: this.context.JWT.data.username,
			receiver: this.state.suggestions[id].user.username,
			type: 'visit',
			new: true
		}
		axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((response) => {
				if (response.data.payload.result === "Missing information") {
					console.log(response.data.payload.result);
				}
				else {
					console.log("visit sent to db successfully");
				}
			})
			.catch((err) => {
				console.log(err);
			})
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		this.getLocation.cancel();
		mySocket.removeAllListeners();
	}

	render() {
		return (
			<HomeDumb 
				popupUser={this.popupUser.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Home;
