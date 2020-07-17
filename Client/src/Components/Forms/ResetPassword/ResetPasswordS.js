import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ResetPasswordDummy from './ResetPasswordD';
import { UserContext } from '../../../Contexts/UserContext';

const axios = require('axios');
const datas = require('../../../Datas/resetForm.json');

class ResetPasswordSmart extends Component {
	constructor (props) {
		super(props);
		console.log(props)
		this.state = {
			orderForm: datas.orderForm,
			hiddenFirst: true,
			hiddenSecond: true,
			formIsValid: false,
			alertDesign: null,
			loading: false,
			token: null,
		};
	}

	static contextType = UserContext;

	componentDidMount () {
		document.getElementById("LogIn").style.display = 'none';
		console.log(this.props.match.params.token);
		axios.get(`http://localhost:4000/API/users/reset/${this.props.match.params.username}/${this.props.match.params.token}`)
			.then(res => {
				console.log(res);
				this.setState({ 
					loading: false,
					formIsValid: true
				});
				if (res.data.success) {
					this.setState({ token: res.data.payload.result });
				}
			})
			.catch(error => {
				this.setState({ 
					loading: false,
					formIsValid: false,
					alertDesign: {
						message: "This link doesn't seem to work anymore...",
						button:"Try Again",
						color: "red"
					}
				});
				console.log(error);
			})
	}

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

	toggleShow = (event, inputIdentifier) => {
		event.preventDefault()
		console.log(inputIdentifier)
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
		if (inputIdentifier === "password") {
			this.setState({ 
				hiddenFirst: !this.state.hiddenFirst,
				orderForm: updatedOrderForm
			});
		}
		else {
			this.setState({ 
				hiddenSecond: !this.state.hiddenSecond,
				orderForm: updatedOrderForm
			});
		}
	}

	submit = (event) => {
		event.preventDefault();
		const { toggleUser } = this.context;
		this.setState({ 
			loading: true,
			formIsValid: false
		});
		let body = null;
		if (this.state.orderForm.password.value === this.state.orderForm.cPasswd.value){
			body = {password: this.state.orderForm.password.value};
		}

		axios.put(`http://localhost:4000/API/users/update/${this.props.match.params.username}`, body, {headers: {"x-auth-token": this.state.token}} )
			.then(res => {
				console.log(res);
				this.setState({ 
					loading: false,
					formIsValid: true
				});
				if (res.data.success && res.data.payload.result.active === "true") {
					this.context.toggleUser(res.data.payload.result.token);
					this.setState({ alertDesign: null });
				}
				else {
					this.setState({ 
						loading: false,
						formIsValid: true,
						alertDesign: {
							message: "Your password has been changed!",
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

	componentWillUnmount() {
		document.getElementById("LogIn").style.display = 'flex';
	}

	render () {
		return (
			<ResetPasswordDummy
				toggleShow={this.toggleShow.bind(this)}
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				submit={this.submit.bind(this)}
				{...this.context}
				{...this.state}
			/>
		)
	}
}

export default withRouter(ResetPasswordSmart);
