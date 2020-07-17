import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import MatchesDummy from './MatchesD';
import { UserContext } from '../../Contexts/UserContext';

const _ = require('lodash');
const mySocket = io('http://localhost:5000');

class MatchesSmart extends Component {

	state = {
		matchesList: [],
		visitsHistoric: [],
		usersOnline: [],
		visits_likesHistoric: []
	};

	static contextType = UserContext;

	componentDidMount() {
		this.getMatches();
		this.getVisits_Likes();
		this.getUsersOnline();
	}

	getMatches = () => {
		axios.get(`http://localhost:4000/API/users/matches/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.matchesSort(res.data.payload.result);
			})
			.catch((err) => console.log(err))
	}

	getVisits_Likes = () => {
		axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/visits`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.setState({ visitsHistoric: res.data.payload.result }, function() {
					axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/likedBy`, {headers: {"x-auth-token": this.context.JWT.token}})
					.then((res) => {
						this.visits_LikesSort(this.state.visitsHistoric, res.data.payload.result);
					})
					.catch((err) => console.log(err))
				})
			})
			.catch((err) => console.log(err))
	}

	getUsersOnline = () => {
		mySocket.on('notification', notification => {
			if (notification.type === 'isOnline') {
				let onlineUsers = [];
				let j = 0;
				for (let i = 0; i < notification.result.length; i++) {
					if (notification.result[i].isOnline === true) {
						onlineUsers[j++] = { name: notification.result[i].username };
					}
				}
				this.setState({ usersOnline: onlineUsers }/*, function() { console.log(this.state.usersOnline); }*/);
			}
		});
	}

	matchesSort = (list) => {
		let sortedList = list;
		sortedList = _.orderBy(sortedList, ['matchCreation'], ['desc']);
		this.setState({ matchesList: sortedList }, function() { console.log(this.state.matchesList); });
	}

	visits_LikesSort = (visitsList, likesList) => {
		let sortedList = visitsList;
		likesList.forEach(elem => {
			elem['type'] = 'like';
			sortedList.push(elem);
		});
		console.log(sortedList);
		sortedList = _.orderBy(sortedList, ['date'], ['desc']);
		console.log(sortedList);
		this.setState({ visits_likesHistoric: visitsList }, function() { console.log(this.state.visits_likesHistoric); });
	}

	componentWillUnmount() {
		mySocket.removeAllListeners();
	}

	render () {
		return (
			<MatchesDummy
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MatchesSmart;
