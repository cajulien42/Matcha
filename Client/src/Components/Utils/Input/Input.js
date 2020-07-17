import React from 'react'

import classes from './Input.module.css'

const input = (props) => {
	let inputElement = null;
	const inputClasses = [classes.inputElement];
	let validationError = [];
	let nameclass = [];

	// console.log(props)
	if (props.invalid && props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid);
		// console.log(props.errorMessage)
		// console.log(props.errorMessage.length)
		if (Array.isArray(props.errorMessage) === true) {
			for (let i = 0; i < props.errorMessage.length; i++) {
				validationError.push(<p className={classes.ValidationError} key={i}>{props.errorMessage[i]}</p>);
			}
			// console.log(validationError);
		}
		else {
			validationError = <p className={classes.ValidationError}>{props.errorMessage}</p>;
		}
	}

	if (typeof props.className != "undefined") {
		if (props.className === "gender") {
			nameclass.push(classes.gender);
		}
		else if (props.className === "sexualOrient") {
			nameclass.push(classes.sexualOrient);
		}
	}

	switch (props.elementType) {
		case ( 'input' ) :
			inputElement = <input
				id={props.id}
				name={props.name}
				style={props.style}
				className={inputClasses.join(' ')} 
				{...props.elementConfig}
				defaultValue={props.value}
				onChange={props.changed} />;
			break;
		case ( 'radio' ) :
			inputElement = 
			<div className={nameclass}>
				{props.elementConfig.options.map(option => {
				return (<div key={option.id}>
					<input
						type={props.elementConfig.type}
						className={`${inputClasses.join(' ')} ${classes.radio}`}
						id={option.id}
						value={option.value}
						checked={props.checked === option.value}
						onChange={props.changed} 
					/>
					<label htmlFor={option.id} className={classes.label}>{option.displayValue}</label>
				</div>)
				})}
			</div>;
			break;
		case ( 'textarea' ):
			inputElement = <textarea 
				className={inputClasses.join(' ')} 
				{...props.elementConfig}
				defaultValue={props.value}
				onChange={props.changed} />;
			break;
		case ( 'select' ):
			/* Dans le SmartComponent, le contenu de "state.elementConfig:" 
			devra être remplacé par "options: [ {value: '', displayValue:''}, ... ]" */
			inputElement = (
				<select 
					className={inputClasses.join(' ')}
					value={props.value}
					onChange={props.changed} >
					{props.elementConfig.options.map(option => (
						<option key={option.value} value={option.value} >
							{option.displayValue}
						</option>
					))}
				</select>
			);
			break;
		default:
			inputElement = <input 
				className={inputClasses.join(' ')} 
				{...props.elementConfig}
				defaultValue={props.value}
				onChange={props.changed} />;
	}

	return (
		<div className={classes.Input}>
			{props.label ?
			<label className={classes.label}>{props.label}</label>
			: null }
			{validationError}
			{inputElement}
		</div>
	)
};

export default input;
