import React, { Component } from 'react';

import SendMailResetDummy from './SendMailResetD';
import { UserContext } from '../../../Contexts/UserContext';

const axios = require('axios');

class SendMailResetSmart extends Component {
	state = {
		username: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Enter your username"
			},
			value: "",
			validation: {
				minLength: 3,
				maxLength: 30,
				regex: "^[a-zA-Z0-9_]{3,30}$",
				db: true,
				rule: "Must not contain anything else than alphabetical characters, numbers or underscores"
			},
			valid: true,
			touched: false,
			errorMessage: ""
		},
		formIsValid: false,
		alertDesign: null,
		loading: false,
		users: null,
	};

	static contextType = UserContext;

	componentDidMount() {
		this.getUsers();
	}

	getUsers = () => {
		axios.get(`http://localhost:4000/API/users/username`)
			.then(response => {
				this.setState({ users: response.data.payload.result });
			})
			.catch(err => { 
				console.log(err);
			})
	}

	checkValidity(value, rules, inputIdentifier, state) {
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
			if (rules.db === true) {
				if (state.users.includes(value) === false) {
					errorMessages.push("Username doesn't exists");
					reject(errorMessages);
				}
				else if (state.users.includes(value) === true) {
					isValid = true && isValid;
					resolve(isValid);
				}
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedFormElement = this.state.username;

		updatedFormElement.value = event.target.value;
		
		this.checkValidity(updatedFormElement.value, updatedFormElement.validation, inputIdentifier, this.state)
			.then((response) => {
				updatedFormElement.valid = response;
				updatedFormElement.touched = true;
				let formIsValid = true;
				this.setState({ username: updatedFormElement, formIsValid: formIsValid });
			})
			.catch((e) => {
				updatedFormElement.valid = false;
				// console.log(e);
				updatedFormElement.touched = true;
				updatedFormElement.errorMessage = e;
				let formIsValid = false;
				this.setState({ username: updatedFormElement, formIsValid: formIsValid });
			})
	}

	submit = (event) => {
		event.preventDefault();
		// console.log(event.target)
		this.setState({ 
			loading: true,
			formIsValid: false
		});

		axios.get(`http://localhost:4000/API/users/sendReset/${this.state.username.value}`)
			.then(res => {
				this.setState({ 
					loading: false,
					formIsValid: true
				});
				if (res.data.success) {
					this.setState({
						alertDesign: {
							message: "An email has been sent to your account.",
							button:"YEAY!",
							color: "green"
						}
					});
				}
			})
			.catch(error => {
				this.setState({ 
					loading: false,
					formIsValid: true,
					alertDesign: {
						message: "Error.",
						button:"Try Again",
						color: "red"
					}
				});
				console.log(error);
			})
	}

	render () {
		return (
			<SendMailResetDummy
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				submit={this.submit.bind(this)}
				{...this.context}
				{...this.state}
			/>
		)
	}
}

export default SendMailResetSmart;
