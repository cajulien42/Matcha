import React, { Component } from 'react';

import { UserContext } from '../../Contexts/UserContext';
import ProfilDummy from './ProfilD';
import axios from 'axios';

const TagDatas = require('../../Datas/tagSuggestions.json');
const formDatas = require('../../Datas/profilForm.json');

class Profil extends Component {
	constructor () {
		super();
		this.state = {
			files: [],
			imagePreviewUrl: '',
			edit: {
				active: false,
				innerHTML: "Edit"
			},
			orderForm: formDatas.orderForm,
			showAlert: false,
			isTags: [],
			isTagsTouched: false,
			lookTags: [],
			lookTagsTouched: false,
			photos : [],
			photosTouched: false,
			displayInput: {display: 'none'},
			currentLocation: null,
			rerender: false,
			clicked: false,
		};
	}

	static contextType = UserContext;

	componentDidMount () {
		let newInfos = this.state.orderForm;
		if (this.context.JWT.data.bio !== undefined) {
			newInfos.bio.value = this.context.JWT.data.bio;
		}
		else {
			newInfos.bio.value = "";
		}
		newInfos.gender.value = this.context.JWT.data.gender;
		newInfos.sexOrient.value = this.context.JWT.data.sexOrient;
		console.log(this.context.JWT.data.sexOrient);
		newInfos.birthdate.value = this.context.JWT.data.birthdate;

		this.setState({
			isTags: this.context.JWT.data.isTags,
			lookTags: this.context.JWT.data.lookTags,
			photos: this.context.JWT.data.photos,
			orderForm: newInfos
		});
		// console.log(document.getElementsByClassName("searchNewLocationInput"));
	}

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
		const updatedOrderForm = {
			...this.state.orderForm
		};

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
					this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
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
					this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
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
			this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
		}
	}

	handleDeleteIAm = (i) => {
		const { isTags } = this.state
		this.setState({
			isTagstouched: true,
			isTags: isTags.filter((tag, index) => index !== i),
		})
	}

	handleAdditionIAm = (tag) => {
		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				return (this.setState({ 
						isTags: [...this.state.isTags, tag],
						isTagsTouched: true }, function() {console.log(this.state)})
				);
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
	}

	handleDeleteLookFor = (i) => {
		const { lookTags } = this.state
		this.setState({
			lookTagstouched: true,
			lookTags: lookTags.filter((tag, index) => index !== i),
		})
	}

	handleAdditionLookFor = (tag) => {
		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				return (this.setState({ 
						lookTags: [...this.state.lookTags, tag],
						lookTagsTouched: true }, function() {console.log(this.state)})
				);
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
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

	handleSubmit(e) {
		e.preventDefault();
		console.log('handle uploading-', this.state.files);
		this.state.files.forEach(elem => {
			const formData = new FormData();
			formData.append('image', elem);
			axios.post('http://localhost:4000/api/photos', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}})
				.then((res) => {
					console.log(res);
					// console.log(th)
					this.setState({
						photos: [...this.state.photos, res.data.url],
						photosTouched: true,
						file: '',
						imagePreviewUrl: ''
					}, function() { 
						console.log(this.state.photos);
						const isDisplayed = {display: 'flex'};
						let elems = document.getElementsByClassName("suppress");
						Array.from(elems).forEach(elem => elem.style.display = 'flex')
					})
				})
		});
	}
	
	handleImageChange(e) {
		e.preventDefault();
	
		let files = [];
		for (let i = 0; i < e.target.files.length; i++){
			let reader = new FileReader();
			files.push(e.target.files[i]);
	
			reader.onloadend = () => {
				this.setState({
					files: files,
					imagePreviewUrl: [...this.state.imagePreviewUrl, reader.result]
				}, function () {console.log(this.state)});
			}
	
			reader.readAsDataURL(e.target.files[i]);
		}
	}

	handleNewProfil = (e) => {
		console.log("handleNewProfil triggered");
		e.preventDefault();
		if (this.state.edit.active === true) {
			const newProfil = e.target.src;
			const oldProfil = document.getElementById("profilPic").src;
			document.getElementById("profilPic").src = newProfil;
			e.target.src = oldProfil;
			let newPhotosOrder = [document.getElementById("profilPic").src];
			let elems = document.getElementsByClassName("otherPic");
			Array.from(elems).forEach(elem => newPhotosOrder.push(elem.src));
			this.setState({ photos: newPhotosOrder, photosTouched:true }, function() {console.log(this.state.photos)})
		}
	}

	deletePic = (e) => {
		e.preventDefault();
		// console.log("deletePic() triggered");
		const photoDel = e.target.parentElement.getElementsByTagName('img')[0].src;
		const newArray = this.state.photos.filter(elem => elem !== photoDel);
		this.setState({ photos: newArray, photosTouched: true });
	}

	geolocateUser = (e) => {
		e.preventDefault();
		this.setState({clicked: true})
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
					axios.get(`http://localhost:4000/API/locate/reverseGeocode/${coords.latitude}/${coords.longitude}`)
						.then((res) => {
							const datas = res.data.payload.adress.address;
							const currentCoords = this.state.currentLocation;
							currentCoords['adress'] = datas.road;
							currentCoords['city'] = datas.village;
							currentCoords['state'] = datas.state;
							currentCoords['postcode'] = datas.postcode;
							currentCoords['country'] = datas.country;
							this.setState({ currentLocation: currentCoords, rerender: true }, function() {
								console.log(this.state.currentLocation); 
								this.setState({rerender: false})
							});
						})
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
									this.setState({ currentLocation: currentCoords, rerender: true }, function() {
										console.log(this.state.currentLocation); 
										this.setState({rerender: false})
									});
								})
						});
					})
				}
			})
		}
	}

	editProfil = (e) => {
		e.preventDefault();
		console.log("editProfil triggered");
		let newEdit = this.state.edit;
		let isDisplayed = null;
		if (this.state.edit.active === false) {
			newEdit.active = true;
			isDisplayed = {display: 'flex'};
			let elems = document.getElementsByClassName("suppress");
			Array.from(elems).forEach(elem => elem.style.display = 'flex')
		}
		else {
			newEdit.active = false;
			isDisplayed = {display: 'none'};

			let elems = document.getElementsByClassName("suppress");
			Array.from(elems).forEach(elem => elem.style.display = 'none')

			let profilChanges = {};
			if (this.state.isTagsTouched === true) {
				profilChanges["isTags"] = this.state.isTags;
			}
			if (this.state.lookTagsTouched === true) {
				profilChanges["tags"] = this.state.lookTags;
			}
			if (this.state.photosTouched === true) {
				profilChanges["photos"] = this.state.photos;
			}
			// eslint-disable-next-line no-unused-vars
			for (let formElementIdentifier in this.state.orderForm) {
				if (this.state.orderForm[formElementIdentifier].touched === true) {
					profilChanges[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
				}
			}
			console.log(profilChanges);
			axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, profilChanges, {headers: {"x-auth-token": this.context.JWT.token}})
				.then((res) => {
					console.log(res);
					this.context.toggleUser(res.data.payload.result.token);
				})
				.catch((err) => console.log(err))
		}
		this.setState({ 
			edit: newEdit,
			displayInput: isDisplayed
		});
	}

	render () {
		return (
			<ProfilDummy
				handleSubmit={this.handleSubmit.bind(this)}
				handleImageChange={this.handleImageChange.bind(this)}
				editProfil={this.editProfil.bind(this)}
				checkValidity={this.checkValidity.bind(this)}
				checkValidity2={this.checkValidity2.bind(this)}
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				handleDeleteIAm={this.handleDeleteIAm.bind(this)}
				handleAdditionIAm={this.handleAdditionIAm.bind(this)}
				handleDeleteLookFor={this.handleDeleteLookFor.bind(this)}
				handleAdditionLookFor={this.handleAdditionLookFor.bind(this)}
				handleChangeTags={this.handleChangeTags.bind(this)}
				geolocateUser={this.geolocateUser.bind(this)}
				deletePic={this.deletePic.bind(this)}
				handleNewProfil={this.handleNewProfil.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Profil;
