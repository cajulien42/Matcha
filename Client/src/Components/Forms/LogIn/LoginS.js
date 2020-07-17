/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';

import { UserContext } from '../../../Contexts/UserContext';
import classes from './LogIn.module.css';
import LoginDumb from './LogInD';

const axios = require('axios');
const datas = require('../../../Datas/loginForm.json');


class Login extends Component {
	constructor (props) {
		super(props);
		console.log(props)
		this.state = {
			orderForm: datas.orderForm,
			formIsValid: false,
			style: '',
			showPopup: false,
			hidden: true,
			loading: false,
			alertDesign: null
		};
	}

	static contextType = UserContext;

	checkValidity(value, rules) {
		let isValid = true;

		if (!rules) {
			return (true);
		}
		if (rules.required) {
			isValid = (value.trim() !== "") && isValid;
		}
		if (rules.minLength) {
			isValid = (value.length >= rules.minLength) && isValid;
		}
		if (rules.maxLength) {
			isValid = (value.length <= rules.maxLength) && isValid;
		}
		if (rules.regex) {
			let regex = RegExp(unescape(rules.regex), 'g')
			isValid = regex.test(value) && isValid;
		}
		return (isValid);
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}
		this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
	}

	handleChange = (event) => {
		const {name, value} = event.target
		if (event.type === "click") {
			event.preventDefault();
			this.setState({
				alertDesign: null
			});
		}
		else {
			event.preventDefault();
			this.setState({[name]: value});
		}
	}

	togglePopup = () => {
		if (this.context.logInPopup)
		{
			this.context.toggleLogInPopup();
			document.getElementById("display_page").style.filter = ''
		}
		else
		{
			this.context.toggleLogInPopup();
			document.getElementById("display_page").style.filter = 'blur(3px)'
		}
	}

	toggleShow = (event, inputIdentifier) => {
		event.preventDefault()
		const newType = this.state.orderForm.password.elementConfig.type === 'password' ? 'text' : 'password';
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		const updatedConfigElement = {
			...updatedFormElement["elementConfig"]
		}
		updatedConfigElement.type = newType;
		updatedOrderForm[inputIdentifier]["elementConfig"] = updatedConfigElement;
		this.setState({ 
			hidden: !this.state.hidden,
			orderForm: updatedOrderForm
		});
	}

	closeLogIn = (e) => {
		console.log(e.target);
		e.preventDefault();
		if (this.context.logInPopup)
		{
			console.log("if OK");
			this.context.toggleLogInPopup();
			document.getElementById("display_page").style.filter = '';
			console.log(this.props);
			this.props.history.push('/send_mail_reset');
		}
		else
		{
			console.log("else");
			this.context.toggleLogInPopup();
			document.getElementById("display_page").style.filter = 'blur(3px)'
		}
	}

	submit = (event) => {
		event.preventDefault();
		const { toggleUser } = this.context;
		// console.log(event.target)
		this.setState({ 
			loading: true,
			formIsValid: false
		});
		const formDatas = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formDatas[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}

		axios.post('http://localhost:4000/API/auth', formDatas)
			.then(response => {
				console.log(response);
				this.setState({ 
					loading: false,
					formIsValid: true
				});
				if (response.data.success) {
					if (response.data.payload === "Please Confirm your email.") {
						this.setState({
							loading: false,
							formIsValid: true,
							alertDesign: {
								message: "Please confirm your email first.",
								button:"OK",
								color: "red"
							}
						});
					} 
					else {
						this.context.toggleUser(response.data.payload);
						this.setState({
							alertDesign: null
						});
					}
				}
				else if (response.data.success === false) {
					this.setState({
						loading: false,
						formIsValid: true,
						alertDesign: {
							message: "Wrong combination password/user",
							button:"Try Again",
							color: "red"
						}
					})
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
			})
	}

	render () {
		const { isLoggedIn, JWT } = this.context;
		return (
			<div className={classes.log}>
				<div key={1}>
					<button 
						className={cx(classes.sidebar, "btn-sm")} 
						id="LogIn"
						onClick={this.togglePopup.bind(this)}>
						Log In
					</button>
					<LoginDumb
						popup={this.togglePopup.bind(this)}
						handleChange={this.handleChange.bind(this)}
						submit={this.submit.bind(this)}
						toggleShow={this.toggleShow.bind(this)}
						inputChangedHandler={this.inputChangedHandler.bind(this)}
						closeLogIn={this.closeLogIn.bind(this)}
						{...this.state}
						{...this.context}
					/>
				</div>
			</div>
		)
	}
}

export default withRouter(Login);
