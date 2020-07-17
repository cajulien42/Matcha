/* eslint-disable no-undef */
import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import UserPageDummy from './UserPageD';
import { UserContext } from '../../../Contexts/UserContext';

class UserPage extends Component {
	constructor (props) {
		super(props);
		this.state = {
			block: {
				node_a: {
					label: "User",
					id: "username",
					properties: {}
				},
				node_b: {
					label: "User",
					id: "username",
					properties: {}
				},
				relation: {
					label: "BLOCK",
					properties: {}
				}
			},
			fake: {
				node_a: {
					label: "User",
					id: "username",
					properties: {}
				},
				node_b: {
					label: "User",
					id: "username",
					properties: {}
				},
				relation: {
					label: "FAKE_ACCOUNT",
					properties: {}
				}
			},
			alertBox: null,
			addClass: null
		}
	}

	static contextType = UserContext;

	componentDidMount () {

	}

	handleChange = (event, message) => {
		if (event.type === "click") {
			if (message === "confirm user") {
				this.setState({
					alertBox: null
				})
			}
			else {
				event.preventDefault();
				this.setState({
					alertBox: null
				});	
			}
		}
	}

	handleThisPic = (event, index) => {
		event.preventDefault();
		const thisDot = event.target;
		const dotFront = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("dotFront")[0];
		const thisPic = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("profilPic")[index];
		const frontPic = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("profilPicFront")[0];
		
		/* Make front picture and dot basic */
		frontPic.classList.remove("profilPicFront");
		dotFront.classList.remove("dotFront");
		frontPic.style.display = 'none';
		dotFront.style.backgroundColor = '#FDF38A';

		/* Make dot clicked and associated picture, front ones */
		thisPic.classList.add("profilPicFront");
		thisDot.classList.add("dotFront");
		thisPic.style.display = 'inline';
		thisDot.style.backgroundColor = "#524A54";
	}
	
	handleHeartClick = (e) => {
		console.log("handleHeartClick() triggered");
		e.preventDefault();
		const token = this.context.JWT.token;
		const allElem = document.getElementsByClassName("empty_heart");
		const elem = allElem[this.props.id];
		if (e.type === "click") {
			axios.put(`http://localhost:4000/API/users/${this.context.JWT.data.username}/toggleLike/${this.props.user.username}`, null, {headers: {"x-auth-token": token}})
				.then(response => {
					// console.log(response.data.payload.result);
					this.setState({ loading: false });
	
					if (response.data.success) {
						let addClass = null;
						let removeClass = null;
						/* Dynamically changes the heart icon depending on if user liked or unliked someone */
						if (response.data.payload.result[0].type === 'unlike' || response.data.payload.result[0].type === 'unmatch') {
							// console.log("change heart to UNLIKE");
							addClass = "far";
							removeClass = "fas";
							this.setState({ addClass: "far fa-heart" });
						}
						else if (response.data.payload.result[0].type === 'like' || response.data.payload.result[0].type === 'match') {
							// console.log("change heart to LIKE");
							addClass = "fas";
							removeClass = "far";
							this.setState({ 
								addClass: "fas fa-heart"
							});
						}
						// console.log("elem was " + removeClass + " and is now " + addClass);
						elem.classList.add(addClass);
						elem.classList.remove(removeClass);

						const mySocket = io('http://localhost:5000');
						response.data.payload.result.map( elem => {
							// console.log(elem.emitter + " " + elem.type + " " + elem.receiver);
							console.log(elem);
							mySocket.emit('notification', elem);
							axios.post('http://localhost:4000/API/notifications/create', elem, {headers: {"x-auth-token": this.context.JWT.token}})
								.then((response) => {
									if (response.data.payload.result === "Missing information") {
										return console.log(response.data.payload.result);
									}
									else {
										console.log(response.data.payload);
										return console.log(elem.type + " sent to db successfully");
									}
								})
								.catch((err) => {
									return console.log(err);
								})
							return true;
						})
					}
				})
			}
	}

	handleBlock = (e) => {
		e.preventDefault();
		const token = this.context.JWT.token;
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.block;
			const userblock = usersnames.node_a;
			const userblocked = usersnames.node_b;
			userblock.properties = { username: this.context.JWT.data.username };
			userblocked.properties = { username: this.props.user.username };
			this.setState({
				block: usersnames
			}, function () { console.log(this.state.block )});
		}

		axios.post('http://localhost:4000/API/relationships/toggle', this.state.block, {headers: {"x-auth-token": token}})
			.then(response => {
				this.setState({ loading: false });
				console.log(response.data);
				if (response.data.success) {
					/* Dynamically changes the css display of block to mark as active and making it unclickable */
					const allElem = document.getElementsByClassName("block");
					const elem = allElem[this.props.id];
					elem.style.color = "#ff665e9f";
					elem.disabled = true;

					document.location.reload(false);
				}
			})
			.catch(error => {
				this.setState({ loading: false });
				console.log(error);
			})
	}

	handleFake = (e) => {
		e.preventDefault();
		const token = this.context.JWT.token;
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.fake;
			const userfake = usersnames.node_a;
			const userfaked = usersnames.node_b;
			userfake.properties = { username: this.context.JWT.data.username };
			userfaked.properties = { username: this.props.user.username };
			this.setState({
				fake: usersnames
			}, function () { console.log(this.state.fake )});
		}

		axios.post(`http://localhost:4000/API/users/${this.context.JWT.data.username}/report/${this.props.user.username}`, null, {headers: {"x-auth-token": token}})
			.then(response => {
				this.setState({ loading: false });
				console.log(response.data);
				if (response.data.success) {
					/* Dynamically changes the css display of fake to mark as active and making it unclickable */
					const color = "#ff665e";
					const allElem = document.getElementsByClassName("fake");
					const elem = allElem[this.props.id];
					elem.style.color = color;
				}
			})
			.catch(error => {
				this.setState({ loading: false });
				console.log(error);
			})
		
	}

	handleClickOutside = (e) => {
		e.preventDefault();
		if (e.target.classList.contains("underDiv")) {
			const id = e.target.id;
			const users = document.querySelectorAll('.back');
			const underDiv = document.querySelectorAll('.underDiv');
			users[id].style.display = "none";
			underDiv[id].style.display = "none";
			document.getElementById("main").style.filter = 'blur(0)'
		}
	}

	render () {
		// console.log(this.props.user);
		return (
			<UserPageDummy 
				handleClickOutside={this.handleClickOutside.bind(this)}
				handleHeartClick={this.handleHeartClick.bind(this)}
				handleChange={this.handleChange.bind(this)}
				handleThisPic={this.handleThisPic.bind(this)}
				handleBlock={this.handleBlock.bind(this)}
				handleFake={this.handleFake.bind(this)}
				{...this.state}
				{...this.props}
			/>
		)
	}
}

export default UserPage;
