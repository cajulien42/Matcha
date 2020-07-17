import React, { Component } from 'react';

import Form from './SignUpD';
import classes from './SignUp.module.css';
import { UserContext } from '../../../Contexts/UserContext';

const axios = require('axios');
const TagDatas = require('../../../Datas/tagSuggestions.json');
const formDatas = require('../../../Datas/signUpForm.json');

class SignUp extends Component {
	state = {
		showPopup: false,
		showAlert: false,
		style: {},
		loading: false,
		formIsValid: false,
		orderForm1: formDatas.orderForm1,
		orderForm2: formDatas.orderForm2,
		range: [18, 25],
		rangeTouched: false,
		localisation: 5,
		sliderTouched: false,
		tags: [
			{ id: "athlete", text: "Athlete" },
			{ id: "geek", text: "Geek" }
		],
		touched: false,
		password: formDatas.password,
		cPasswd: formDatas.cPasswd,
		users: [],
		emails: [],
		erros: [],
		retSubmit: null
	}

	static contextType = UserContext;

	checkValidity2(value, rules, inputIdentifier) {
		let isValid = true;
		let errorMessages = [];

			if (!rules) {
				return (true);
			}
			if (rules.required) {
				isValid = (value.trim() !== "") && isValid;
				if (inputIdentifier !== undefined && value.trim() === "")
				{	
					errorMessages.push("This field is required");
					return (errorMessages);
				}
			}
			if (!rules.required) {
				if ((value.trim() === "")) {
					// console.log("not required");
					return (true);
				}
			}
			if (rules.minLength) {
				isValid = (value.length >= rules.minLength) && isValid;
				if (inputIdentifier !== undefined && (value.length < rules.minLength))
				{	
					errorMessages.push("This field requires at least " + rules.minLength + " characters");
					return (errorMessages);
				}
			}
			if (rules.maxLength) {
				isValid = (value.length <= rules.maxLength) && isValid;
				if (inputIdentifier !== undefined && (value.length > rules.maxLength))
				{	
					errorMessages.push("This field must not exceed " + rules.maxLength + " characters");
					return (errorMessages);
				}
			}
			if (rules.regex) {
				isValid = RegExp(unescape(rules.regex), 'g').test(value) && isValid;
				if (!isValid)
				{
					errorMessages.push(rules.rule);
					return (errorMessages);
				}
			}
		return (isValid);
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
				if (state.emails.includes(value) === false) {
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
				else if (state.users.includes(value) === true) {
					errorMessages.push("Username already taken");
					reject(errorMessages);
				}
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		let updatedOrderForm = {};
		const trueOrderForm = inputIdentifier === "birthdate" || inputIdentifier === "gender" || inputIdentifier === "sexualOrient" || inputIdentifier === "bio" ? "orderForm2" : "orderForm1";

		trueOrderForm === "orderForm2" ?
		updatedOrderForm = { ...this.state.orderForm2 }
		: updatedOrderForm = { ...this.state.orderForm1 };

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		updatedFormElement.value = event.target.value;
		if (inputIdentifier !== "birthdate") {
			this.checkValidity(updatedFormElement.value, updatedFormElement.validation, inputIdentifier, this.state)
				.then((response) => {
					// console.log(response);
					updatedFormElement.valid = response;
					updatedFormElement.touched = true;
					updatedOrderForm[inputIdentifier] = updatedFormElement;

					let formIsValid = true;
					// eslint-disable-next-line no-unused-vars
					for (let inputIdentifier in updatedOrderForm) {
						formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
					}
					trueOrderForm === "orderForm2" ?
					this.setState({ orderForm2: updatedOrderForm, formIsValid: formIsValid })
					: this.setState({ orderForm1: updatedOrderForm, formIsValid: formIsValid });
				})
				.catch((e) => {
					updatedFormElement.valid = false;
					// console.log(e);
					updatedFormElement.touched = true;
					updatedFormElement.errorMessage = e;
					updatedOrderForm[inputIdentifier] = updatedFormElement;

					let formIsValid = true;
					// eslint-disable-next-line no-unused-vars
					for (let inputIdentifier in updatedOrderForm) {
						formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
					}
					trueOrderForm === "orderForm2" ?
					this.setState({ orderForm2: updatedOrderForm, formIsValid: formIsValid })
					: this.setState({ orderForm1: updatedOrderForm, formIsValid: formIsValid });
				})
		}
		else {
			const ret = this.checkValidity2(updatedFormElement.value, updatedFormElement.validation);
			if (typeof ret === "boolean") {
				updatedFormElement.valid = ret;
			}
			else {
				updatedFormElement.valid = false;
				updatedFormElement.errorMessage = ret;
			}
			updatedFormElement.touched = true;
			updatedOrderForm[inputIdentifier] = updatedFormElement;

			let formIsValid = true;
			// eslint-disable-next-line no-unused-vars
			for (let inputIdentifier in updatedOrderForm) {
				formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
			}
			this.setState({ orderForm2: updatedOrderForm, formIsValid: formIsValid });
		}
	}

	togglePopup = () => {
		this.state.showPopup ?
		this.setState({
			showPopup: !this.state.showPopup,
			style: {}
		}) :
		this.setState({
			showPopup: !this.state.showPopup,
			style: {
				filter: 'blur(3px)'
			}
		});
		this.getUsers();
		this.getEmails();
	}

	handleChangeTags = (event) => {
		if (event.type === 'click')
		{
			event.preventDefault();
			this.setState({
				showAlert: !this.state.showAlert
			})
		}
	}

	handleChange = (event, message) => {
		if (event.type === 'click')
		{
			event.preventDefault();
			this.setState({
				retSubmit: null
			})
			if (message === "go to log in"){
				this.setState({ showPopup: !this.state.showPopup })
			}
		}
	}

	handleSlider = (newValue) => {
		this.setState({
			localisation: newValue,
			sliderTouched: true
		})
	}

	handleRange = (newValue) => {
		this.setState({
			range: newValue,
			rangeTouched: true
		})
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
			this.checkValidity(updatedElem.value, updatedElem.validation, name, this.state)
				.then((response) => {
					// console.log(response);
					updatedElem.valid = response;
					updatedElem.touched = true;
					updatedElem.value === "" ?
					updatedElem.score = null
					:
					updatedElem.score = value.score;
					this.setState({ [name]: updatedElem });
				})
				.catch((e) => {
					// console.log(e);
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
		// console.log(updatedElem);
		this.setState({ [name]: updatedElem });
	}

	handleDelete = (i) => {
		const { tags } = this.state
		this.setState({
			touched: true,
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				return (this.setState(
					state => ({ 
						tags: [...state.tags, tag],
						touched: true })
				));
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
	}

	nextStep = (props) => {
		let current_fs, next_fs; //fieldsets
		let progressBar;

		current_fs = props.target.parentElement;
		next_fs = current_fs.nextElementSibling;
		progressBar = current_fs.parentElement.childNodes[1].childNodes;
		
		// activate next step on progressbar
		for (let i = 0; i < progressBar.length; i++)
			if (progressBar[i].className.search(/active/i) === -1)
			{
				progressBar[i].classList.add(classes.active)
				break;
			}

		//show the next fieldset
		next_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	}


	previousStep = (props) => {
		let current_fs, previous_fs;
		let progressBar;

		current_fs = props.target.parentElement;
		previous_fs = current_fs.previousElementSibling;
		progressBar = current_fs.parentElement.childNodes[1].childNodes;

		for (let i = (progressBar.length - 1); i > 0; i--)
			if (progressBar[i].className.search(/active/i) !== -1)
			{
				progressBar[i].classList.remove(classes.active)
				break;
			}

		//show the previous fieldset
		previous_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	}

	submit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		let submitDatas = {
			password: this.state.password.value 
		};

		if (this.state.touched === true) {
			submitDatas["tags"] = this.state.tags;
		}
		if (this.state.sliderTouched === true) {
			submitDatas["localisation"] = this.state.localisation;
		}
		if (this.state.rangeTouched === true) {
			submitDatas["ageMin"] = this.state.range[0];
			submitDatas["ageMax"] = this.state.range[1];
		}
		if (this.state.orderForm2.birthdate.touched === true) {
			submitDatas["birthdate"] = this.state.orderForm2.birthdate.value;
		}
		if (this.state.orderForm2.gender.touched === true && this.state.orderForm2.gender.value.trim() !== "") {
			submitDatas["gender"] = this.state.orderForm2.gender.value;
		}
		if (this.state.orderForm2.sexualOrient.touched === true && this.state.orderForm2.sexualOrient.value.trim() !== "") {
			submitDatas["sexOrient"] = this.state.orderForm2.sexualOrient.value;
		}
		if (this.state.orderForm2.bio.touched === true && this.state.orderForm2.bio.value.trim() !== "") {
			submitDatas["bio"] = this.state.orderForm2.bio.value;
		}
		
		// eslint-disable-next-line no-unused-vars
		for (let formElementIdentifier in this.state.orderForm1) {
				submitDatas[formElementIdentifier] = this.state.orderForm1[formElementIdentifier].value;
		}
		console.log(submitDatas);

		axios
			.post('http://localhost:4000/API/users', submitDatas)
			.then(response => {
				this.setState({ loading: false })
				console.log(response)
				if (response.data.success) {
					this.setState({
						retSubmit: {
							message:"Your account have been successfully created !",
							button:"Log In",
							color: "green",
							function: true
						}
					});
				}
			})
			.catch(error => {
				this.setState({
					errors: error.response.data.payload,
					loading: false
				})
				console.log(error.response.data.payload)
				this.setState({
					retSubmit: {
						message: error.response.data.payload,
						button:"Try Again",
						color: "red"
					}
				});
			})
	}
	
	render () {
		return (
			<Form 
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				popup={this.togglePopup.bind(this)}
				handleChange={this.handleChange.bind(this)}
				handleChangeTags={this.handleChangeTags.bind(this)}
				passwordStrength={this.passwordStrength.bind(this)}
				nextStep={this.nextStep.bind(this)}
				previousStep={this.previousStep.bind(this)}
				handleRange={this.handleRange.bind(this)}
				handleSlider={this.handleSlider.bind(this)}
				handleAddition={this.handleAddition.bind(this)}
				handleDelete={this.handleDelete.bind(this)}
				submit={this.submit.bind(this)}
				{...this.state}
			/>
		);
	}
}

export default SignUp;
