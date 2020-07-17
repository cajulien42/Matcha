import React from 'react';
// import cx from 'classnames';

import classes from './Account.module.css';
import Input from '../../Utils/Input/Input';
import PasswdStrength from '../../Utils/PasswdStrength/PasswdStrength';
import AlertBox from '../../Utils/AlertBox/AlertBox';

const Account = (props) => {
	let formElementsArray = [];

	// eslint-disable-next-line no-unused-vars
	for (let key in props.orderForm) {
		formElementsArray.push({
			id: key,
			config: props.orderForm[key]
		});
	}

	return (
		<div className={classes.main}>
			<form id={classes.msform}>
			{props.alertDesign ?
			<AlertBox
				message={props.alertDesign.message}
				button={props.alertDesign.button}
				handleChange={props.handleChange}
				color={props.alertDesign.color}
				function={props.alertDesign.function}
				logIn={true}
				toggleUser={props.toggleUser}
			/>
			: null}
				<fieldset>
					<h2 className={classes.fs_title}>Manage your account</h2>
					{formElementsArray.map((formElement) => {
						// console.log(formElement.config.errorMessage)
                		return (
							<Input 
                			    key={formElement.id}
                			    elementType={formElement.config.elementType}
                			    elementConfig={formElement.config.elementConfig}
                			    value={formElement.config.value || ""}
                			    invalid={!formElement.config.valid}
                			    shouldValidate={formElement.config.validation}
								touched={formElement.config.touched}
								errorMessage={formElement.config.errorMessage}
								changed={(event) => props.inputChangedHandler(event, formElement.id)}
								checked={props.orderForm[formElement.id].value}
							/>
						)
					})}
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
						type="submit" 
						name="submit" 
						className={classes.action_button} 
						value="Submit" 
						onClick={props.submit}
						disabled={!props.formIsValid}
					/>
				</fieldset>
			</form>
		</div>
	)
}

export default Account;
