import React, { Component } from 'react';
import io from 'socket.io-client';

import MessagesDummy from './MessagesD';
import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';

const _ = require('lodash');

class MessagesSmart extends Component {
	_isMounted = false;

	state = {
		matchList: [],
		sendBar: {
			elementType: 'input',
			elementConfig: {
				type: "text",
				placeholder: "Write a message"
			},
			value: '',
			validation: {
				minLength: 1,
				maxLength: 255,
				regex: "^[%5Cw 0-9_-àæéèêëçàùûîïÀÆÉÈÊÇÀÛÙÜÎÏ,.;:?!'\"&%/]{1,255}$",
				rule: "You used invalid characters..."
			},
			valid: true,
			touched: false,
			errorMessage: "",
			title: 'sendBar'
		},
		formIsValid: true,
		messagesList: [],
		currentInterlocutor: null,
		activeDiv: false,
		unread: false
	};

	static contextType = UserContext;

	componentDidMount() {
		this._isMounted = true;

		if (this._isMounted) {
			axios.get(`http://localhost:4000/API/users/matches/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
				.then((res) => {
					// console.log(res)
						this.sortMatchList(res.data.payload.result);
				})
				.catch((err) => console.log(err))
		}
	}

	sortMatchList = (list) => {
		axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/conversations`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				let lastMessage = res.data.payload.result;
				lastMessage = _.orderBy(lastMessage, ['lastMessage.date'], ['desc']);
				// console.log(lastMessage);
				// console.log(list);
				let sortedList = [];
				sortedList = _.orderBy(sortedList, ['matchCreation'], ['desc']);
				for (let i = 0; i < lastMessage.length; i++) {
					for (let j = 0; j < list.length; j++) {
						if (list[j].user.username === lastMessage[i].username) {
							sortedList[i] = list[j];
						}
					}
				}
				if (list.length > lastMessage.length) {
					let howMuch = list.length - lastMessage.length;
					console.log(howMuch);
					let k = 0;
					for (howMuch; howMuch > 0; howMuch--) {
						sortedList.push(list[k++]);
					}
				}
				this.setState({ matchList: sortedList }, function() { console.log(this.state.matchList); });
			})
			.catch((err) => console.log(err))
	}

	getConversation = (e, username) => {
		this.setState({ activeDiv: true });

		/* If there's a new message from the notifications, we get again the conversation */
		if (this.context.newNotif.new) {
			this.context.toggleNotifReceived(this.context.newNotif);
			axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/conversationWith/${this.context.newNotif.emitter}`, {headers: {"x-auth-token": this.context.JWT.token}})
				.then((res) => {
					this.setState({ 
						messagesList: res.data.payload.result[0].conversation,
						currentInterlocutor: this.context.newNotif.emitter
					})
				})
				.catch((err) => console.log(err))
		}
		/* If the user just sent a message, we get the conversation again in order for the new message to appear in real time */
		else if (e === "get") {
			axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/conversationWith/${this.state.currentInterlocutor}`, {headers: {"x-auth-token": this.context.JWT.token}})
				.then((res) => {
					this.setState({ 
						messagesList: res.data.payload.result[0].conversation
					}/*, function() {console.log(this.state.messagesList)}*/)
				})
				.catch((err) => console.log(err))
		}
		/* If the user just clicked on a user's div, we get the conversation */
		else {
			e.preventDefault();
			axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/conversationWith/${username}`, {headers: {"x-auth-token": this.context.JWT.token}})
				.then((res) => {
					console.log(res)
					if (res.data.payload.result[0]) {
						this.setState({ 
							messagesList: res.data.payload.result[0].conversation,
							currentInterlocutor: username
						}/*, function() {console.log(this.state.messagesList)}*/)
					}
					else {
						this.setState({
							messagesList: [{notif: {message: "No message to display. Go ahead and send the first one !", emitter: "admin"}}],
							currentInterlocutor: username
						}/*, function() {console.log(this.state.messagesList)}*/)
					}
				})
				.catch((err) => console.log(err))
		}

		/* Automatically set all messages as true for read for the user's div clicked */
		this.state.matchList.forEach((elem, i) => {
			if (elem.user.username === username) {
				if (elem.unreadMessages[0].id !== null) {
					for (let k = 0; k < elem.unreadMessages.length; k++) {
						let messagesID = null;
						messagesID = { id: elem.unreadMessages[k].id.low, receiver: this.context.JWT.data.username };
						axios.put(`http://localhost:4000/API/notifications/read/`, messagesID, {headers: {"x-auth-token": this.context.JWT.token}})
							.then((res) => {
								if (res.data.payload.result === "notification has been read") {
									let isRead = this.state.matchList;
									isRead[i]['isRead'] = true;
									this.setState({ matchList: isRead })
								}
							})
							.catch((err) => console.log(err))
					}
				}
			}
		});
	}

	checkValidity(value, rules, inputIdentifier) {
		return new Promise (function (resolve, reject) {
			let isValid = true;
			let errorMessages = [];

			if (!rules) {
				resolve(true);
			}
			if (rules.required === true) {
				isValid = (value.trim() !== "") && isValid;
				if (inputIdentifier !== undefined && value.trim() === "")
				{	
					errorMessages.push("This field is required");
					reject(errorMessages);
				}
			}
			if (!rules.required) {
				if ((value.trim() === "")) {
					resolve(true);
				}
			}
			if (rules.minLength) {
				isValid = (value.length >= rules.minLength) && isValid;
				if (inputIdentifier !== undefined && (value.length < rules.minLength))
				{	
					errorMessages.push("This field requires at least " + rules.minLength + " characters");
					reject(errorMessages);
				}
			}
			if (rules.maxLength) {
				isValid = (value.length <= rules.maxLength) && isValid;
				if (inputIdentifier !== undefined && (value.length > rules.maxLength))
				{	
					errorMessages.push("This field must not exceed " + rules.maxLength + " characters");
					reject(errorMessages);
				}
			}
			if (rules.regex) {
				isValid = RegExp(unescape(rules.regex), 'g').test(value) && isValid;
				if (inputIdentifier !== undefined && (RegExp(unescape(rules.regex), 'g').test(value) === false))
				{	
					errorMessages.push(rules.rule);
					reject(errorMessages);
				}
			}
			if(!rules.db && !rules.checkEmail) {
				resolve(isValid);
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.sendBar
		};

		updatedOrderForm.value = event.target.value;
		this.checkValidity(updatedOrderForm.value, updatedOrderForm.validation, inputIdentifier)
			.then((response) => {
				console.log(response);
				updatedOrderForm.valid = response;
				updatedOrderForm.touched = true;
				this.setState({ sendBar: updatedOrderForm }/*, function() {console.log(this.state.sendBar.value)}*/);
			})
			.catch((e) => {
				updatedOrderForm.valid = false;
				console.log(e);
				updatedOrderForm.touched = true;
				updatedOrderForm.errorMessage = e;
				this.setState({ sendBar: updatedOrderForm });
			})
	}

	sendMessage = (e) => {
		e.preventDefault();
		const message = {
			type:'message', 
			emitter: this.context.JWT.data.username, 
			receiver: this.state.currentInterlocutor, 
			message: this.state.sendBar.value
		}
		if (this.state.sendBar.valid === true) {
			axios.post('http://localhost:4000/API/notifications/create', message, {headers: {"x-auth-token": this.context.JWT.token}})
				.then((res) => {
					if (res.data.payload.result === "missing information") {
						console.log("ERROR sendMessage()");
					}
					else {
						document.getElementById("sendBar").value = "";
						const sendBarCleared = this.state.sendBar;
						sendBarCleared.value = '';
						this.setState({ sendBar: sendBarCleared });
						this.getConversation("get");
						this.sortMatchList(this.state.matchList);
					}
				})
				.catch((err) => console.log(err))

			const mySocket = io('http://localhost:5000');
			mySocket.emit('notification', 
						{type:'message', 
						emitter: this.context.JWT.data.username, 
						receiver: this.state.currentInterlocutor});
		}
		else {
			console.log("not valid:" + this.state.sendBar.errorMessage);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidUpdate() {
		if (this.context.newNotif.new === true) {
			this.getConversation();
		}
	}

	render() {
		return (
			<MessagesDummy
				getConversation={this.getConversation.bind(this)}
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				sendMessage={this.sendMessage.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MessagesSmart;
