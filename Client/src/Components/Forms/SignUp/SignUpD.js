/* eslint-disable no-unused-vars */
import React from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import PasswdStrength from '../../Utils/PasswdStrength/PasswdStrength';
import Tags from '../../Utils/Tags/Tags';
import classes from './SignUp.module.css';
import AlertBox from '../../Utils/AlertBox/AlertBox';
import Input from '../../Utils/Input/Input';

const SignUp = (props) => {
	let formElementsArray1 = [];
	let formElementsArray2 = [];

	for (let key in props.orderForm1) {
		formElementsArray1.push({
			id: key,
			config: props.orderForm1[key]
		});
	}
	for (let key in props.orderForm2) {
		formElementsArray2.push({
			id: key,
			config: props.orderForm2[key]
		});
	}

	// console.log(props);
	return (
		<div>
			<div className={classes.display_page} id="display_page" style={props.style}>
				<h2>Matchez, Discutez<br />Faites des rencontres.</h2>
				<button className={classes.sign_up} onClick={props.popup}>Sign Up</button>
			</div>
			{props.showPopup ?  
			<div className={classes.popup}>
				<div className={classes.popup_inner}>
					<form id={classes.msform}>
						{props.showAlert ? 
						<AlertBox 
							message="Please choose a Tag amongst the suggestions"
							button="Try Again"
							color="red"
							handleChange={props.handleChangeTags}
						/>
						: null}
						{props.retSubmit ?
						<AlertBox
							message={props.retSubmit.message}
							button={props.retSubmit.button}
							handleChange={props.handleChange}
							color={props.retSubmit.color}
							function={props.retSubmit.function}
							// handleChangeTags={props.handleChangeTags}
						/>
						: null}
						<button type="button" onClick={props.popup} className={`${classes.close} ${classes.heavy} ${classes.rounded}`}></button>
						<ul id={classes.progressbar}>
							<li className={classes.active}>Account Setup</li>
							<li>Personal Details</li>
							<li>Preferences</li>
						</ul>
						<fieldset>
							<h2 className={classes.fs_title}>Create your account</h2>
							<h3 className={classes.fs_subtitle}>This is step 1</h3>
							{formElementsArray1.map(formElement => (
								// console.log(formElement),
                			    <Input 
                			        key={formElement.id}
                			        elementType={formElement.config.elementType}
                			        elementConfig={formElement.config.elementConfig}
                			        value={formElement.config.value}
                			        invalid={!formElement.config.valid}
                			        shouldValidate={formElement.config.validation}
									touched={formElement.config.touched}
									errorMessage={formElement.config.errorMessage}
									changed={(event) => props.inputChangedHandler(event, formElement.id)}
								/>
							))}
							<PasswdStrength
								name="password"
								style={{marginBottom: '0'}}
								password={props.password}
								score={props.password.score} 
								strengthMeter={props.passwordStrength}
								invalid={!props.password.valid}
                			    validation={props.password.validation}
								touched={props.password.touched}
								errorMessage={props.password.errorMessage}
								
							/>
							<PasswdStrength 
								name="cPasswd"
								style={{marginBottom: '0'}}
								password={props.cPasswd} 
								score={props.cPasswd.score} 
								strengthMeter={props.passwordStrength}
								invalid={!props.cPasswd.valid}
                			    validation={props.cPasswd.validation}
								touched={props.cPasswd.touched}
								errorMessage={props.cPasswd.errorMessage}
							/>
							<input 
								type="button" 
								name="next" 
								className={`${classes.next} ${classes.action_button}`} 
								value="Next" 
								onClick={props.nextStep}
							/>
						</fieldset>
						<fieldset>
							<h2 className={classes.fs_title}>Tell us more about yourself</h2>
							<h3 className={classes.fs_subtitle}>Who are you ?</h3>
							{formElementsArray2.map(formElement => (
								<div key={formElement.id}>
								{formElement.id ?
								<h3 className={classes.questions}>{formElement.config.title}</h3>
								: null}
                			    <Input
									className={formElement.id}
                			        key={formElement.id}
                			        elementType={formElement.config.elementType}
                			        elementConfig={formElement.config.elementConfig}
                			        value={formElement.config.value}
                			        invalid={!formElement.config.valid}
                			        shouldValidate={formElement.config.validation}
									touched={formElement.config.touched}
									errorMessage={formElement.config.errorMessage}
									changed={(event) => props.inputChangedHandler(event, formElement.id)}
									checked={props.orderForm2[formElement.id].value}
								/>
								</div>
                			))}
							<input 
								type="button" 
								name="previous" 
								className={`${classes.previous} ${classes.action_button}`} 
								value="Previous" 
								onClick={props.previousStep}
							/>
							<input 
								type="button" 
								name="next" 
								className={`${classes.next} ${classes.action_button}`} 
								value="Next"
								onClick={props.nextStep}
							/>
						</fieldset>
						<fieldset>
							<h2 className={classes.fs_title}>What are you looking for?</h2>
							<h3 className={classes.fs_subtitle}>This will improve our algorithm</h3>
							<div className={classes.step3}>
								<h3 className={classes.questionsS3}>Age Range</h3>
								<h4 className={classes.values}>{props.range[0]} - {props.range[1]}</h4>
								<Range
									min={18}
									max={100}
									defaultValue={[18, 25]}
									// value={props.range}
									count={1}
									pushable={true}
									onChange={props.handleRange}
								/>
							</div>
							<div className={classes.step3}>
								<h3 className={classes.questionsS3}>Maximum Distance</h3>
								<h4 className={classes.values}>{props.localisation}km</h4>
								<Slider
									min={3}
									max={160}
									defaultValue={5}
									// value={props.localisation}
									count={1}
									onChange={props.handleSlider}
								/>
							</div>
							<Tags
								title="What traits do you find most attractive?"
								divclassname={classes.step3}
								h3classname={classes.questionsS3}
								tags={props.tags}
								handleDelete={props.handleDelete}
								handleAddition={props.handleAddition}
							/>
							<input 
								type="button" 
								name="previous" 
								className={`${classes.previous} ${classes.action_button}`} 
								value="Previous"
								onClick={props.previousStep}
							/>
							<input 
								type="submit" 
								name="submit" 
								className={`${classes.submit} ${classes.action_button}`} 
								value="Submit" 
								onClick={props.submit}
								disabled={!props.formIsValid}
							/>
						</fieldset>
					</form>
				</div>
			</div>
			: null }  
		</div>
	);
}

export default SignUp;
