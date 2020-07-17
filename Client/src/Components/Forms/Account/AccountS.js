import React, { Component } from 'react';

import AccountDumb from './AccountD';
import { UserContext } from '../../../Contexts/UserContext';

const formDatas = require('../../../Datas/accountForm.json');
const axios = require('axios');

class Account extends Component {
	constructor(props) {
		super(props);
		// console.log(props);
		this.state = {
			orderForm: formDatas.orderForm,
			emails: null,
			formIsValid: false,
			password: formDatas.password,
			cPasswd: formDatas.cPasswd,
			erros: [],
			alertDesign: null,
			payload: null
		}
		this.getEmails();
		this.getUsers();
	}

	static contextType = UserContext;

	componentDidMount() {
		this.getUserInfos();
	}

	getUserInfos = () => {
		const userDatas = this.context.JWT.data;

		// eslint-disable-next-line no-unused-vars
		for (let key in this.state.orderForm) {
			let elem = this.state.orderForm[key];
			elem.value = userDatas[key]
			this.setState({
				[key]: elem
			});
		}
	}

	getUsers = () => {
		axios.get(`http://localhost:4000/API/users/username`)
			.then(response => {
				// console.log(response.data.payload.result);
				this.setState({ users: response.data.payload.result });
			})
			.catch(err => { 
				console.log(err);
			})
	}

	getEmails = () => {
		axios.get(`http://localhost:4000/API/users/email`)
			.then(response => {
				// console.log(response.data.payload.result);
				this.setState({ emails: response.data.payload.result });
			})
			.catch(err => { 
				console.log(err);
			})
	}

	checkValidity(value, rules, inputIdentifier, state, context) {
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
			if (rules.checkEmail === true) {
				// console.log(state)
				if (state.emails.includes(value) === false) {
					isValid = true && isValid;
					resolve(isValid);
				}
				else if (state.emails.includes(value) === true && context[inputIdentifier] === value) {
					isValid = true && isValid;
					resolve(isValid);
				}
				else if (state.emails.includes(value) === true) {
					isValid = false;
					errorMessages.push("This e-mail adress is already being used");
					reject(errorMessages);
				}
			}
			if (rules.db === true) {
				if (state.users.includes(value) === false) {
					isValid = true && isValid;
					resolve(isValid);
				}
				else if (state.users.includes(value) === true && context[inputIdentifier] === value) {
					isValid = true && isValid;
					resolve(isValid);
				}
				else if (state.users.includes(value) === true) {
					errorMessages.push("Username already taken");
					reject(errorMessages);
				}
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = { ...this.state.orderForm };

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};

		updatedFormElement.value = event.target.value;
		
		// if (updatedFormElement.value !== this.context.JWT.data[inputIdentifier]) {
			this.checkValidity(updatedFormElement.value, updatedFormElement.validation, inputIdentifier, this.state, this.context.JWT.data)
				.then((response) => {
					// console.log(response);
					updatedFormElement.valid = response;
					if (response && updatedFormElement.value !== this.context.JWT.data[inputIdentifier]) {
						updatedFormElement.touched = true;
					}
					else if (response && updatedFormElement.value === this.context.JWT.data[inputIdentifier]) {
						updatedFormElement.touched = false;
					}
					updatedOrderForm[inputIdentifier] = updatedFormElement;
					let formIsValid = true;
					// eslint-disable-next-line no-unused-vars
					for (let inputIdentifier in updatedOrderForm) {
						formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
					}
					this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
				})
				.catch((e) => {
					updatedFormElement.valid = false;
					console.log(e);
					updatedFormElement.touched = true;
					updatedFormElement.errorMessage = e;
					updatedOrderForm[inputIdentifier] = updatedFormElement;
					let formIsValid = true;
					// eslint-disable-next-line no-unused-vars
					for (let inputIdentifier in updatedOrderForm) {
						formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
					}
					this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
				})
		// }
	}

	handleChange = (event, message) => {
		if (event.type === 'click')
		{
			event.preventDefault();
			if (message === "confirm user"){
				// console.log(this.state)
				this.context.toggleUser(this.state.payload);
				this.setState({
					payload: null,
					alertDesign: null
				})
			}
			else {
				this.setState({
					alertDesign: null
				});	
			}
		}
	}

	passwordStrength = (event) => {
		const name = event.target.name;
		var zxcvbn = require('zxcvbn');
		event.preventDefault();
		let value = zxcvbn(event.target.value);
		const updatedElem = {
			...this.state[name]
		};
		updatedElem.value = event.target.value;
		if (name === "password") {
			this.checkValidity(updatedElem.value, updatedElem.validation, name, this.state, this.context.JWT.data)
				.then((response) => {
					console.log(response);
					updatedElem.valid = response;
					updatedElem.touched = true;
					updatedElem.value === "" ?
					updatedElem.score = null
					:
					updatedElem.score = value.score;
					this.setState({ [name]: updatedElem });
				})
				.catch((e) => {
					console.log(e);
					updatedElem.valid = false;
					updatedElem.touched = true;
					updatedElem.errorMessage = e;
					updatedElem.value === "" ?
					updatedElem.score = null
					:
					updatedElem.score = value.score;
					this.setState({ [name]: updatedElem });
				})
		}
		else if (name === "cPasswd") {
			if (event.target.value === this.state.password.value)
				updatedElem.valid = true;
			else
				updatedElem.valid = false;
		}
		updatedElem.touched = true;
		event.target.value === "" ?
		updatedElem.score = null
		:
		updatedElem.score = value.score;
		this.setState({ [name]: updatedElem, formIsValid: updatedElem.valid });
	}

	submit = (e) => {
		e.preventDefault();
		let submitDatas = {};
		let context =  this.context.JWT.data;
		const token = this.context.JWT.token;
		// console.log(token);

		console.log(this.state.orderForm)
		// eslint-disable-next-line no-unused-vars
		for (let key in this.state.orderForm) {
			console.log(key)
			console.log(submitDatas);
			console.log( context[key]);
			if (this.state.orderForm[key].touched === true) {
				// console.log(this.state.orderForm[key]);
				if (key !=="email" && this.state.orderForm[key].value !== context[key].value) {
					submitDatas[key] = this.state.orderForm[key].value; 
				}
				else if (key === "email") {
					submitDatas[key] = this.state.orderForm[key].value; 
				}
			}
		}
		if (this.state.password.touched === true) {
			submitDatas['password'] = this.state.password.value;
		}
		console.log(submitDatas);

		axios
			.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, submitDatas, {headers: {"x-auth-token": token}})
			.then(response => {
				this.setState({ loading: false })
				// console.log(response);
				console.log(response.data.payload)
				if (response.data.success) {
					this.setState({
						alertDesign: {
							message:"Your infos have been successfully changed !",
							button:"OK",
							color: "green",
							function: true
						},
						payload: response.data.payload.result.token
					});
					this.context.toggleUser(response.data.payload.result.token);
				}
				if (submitDatas.email) {
					this.getEmails();
				}
				if (submitDatas.username) {
					this.getUsers();
				}
			})
			.catch(error => {
				this.setState({
					errors: error,
					loading: false
				})
				console.log(error)
				this.setState({
					alertDesign: {
						message: error,
						button:"Try Again",
						color: "red"
					}
				});
			})
	}

	render() {
		return (
			<AccountDumb
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				handleChange={this.handleChange.bind(this)}
				passwordStrength={this.passwordStrength.bind(this)}
				submit={this.submit.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Account;
