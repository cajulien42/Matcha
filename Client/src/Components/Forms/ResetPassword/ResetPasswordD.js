import React from 'react';
import cx from 'classnames';

import classes from './ResetPassword.module.css';
import AlertBox from '../../Utils/AlertBox/AlertBox';
import Input from '../../Utils/Input/Input';

const ResetPasswordDummy = (props) => {
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
					/>
					: null
				}
				<fieldset>
					<h2 className={classes.fs_title}>Reset</h2>
					<h3 className={classes.fs_subtitle}>Choose a new password</h3>
					<div className={classes.passwdCont}>
						<Input
							key={formElementsArray[0].id}
							elementType={formElementsArray[0].config.elementType}
							elementConfig={formElementsArray[0].config.elementConfig}
							value={formElementsArray[0].config.value}
							changed={(event) => props.inputChangedHandler(event, formElementsArray[0].id)}
							invalid={!formElementsArray[0].config.valid}
							shouldValidate={formElementsArray[0].config.validation}
							touched={formElementsArray[0].config.touched}
							errorMessage="Must be at least 7 characters long and contain 1 lowercase, 1 uppercase, 1 number and 1 special character."
						/>
						<span
							className={classes.passwdToggle}
							onClick={(event) => props.toggleShow(event, formElementsArray[0].id)}
						>{props.hiddenFirst ? "Show" : "Hide"}</span>
					</div>
					<div className={classes.passwdCont}>
						<Input
							key={formElementsArray[1].id}
							elementType={formElementsArray[1].config.elementType}
							elementConfig={formElementsArray[1].config.elementConfig}
							value={formElementsArray[1].config.value}
							changed={(event) => props.inputChangedHandler(event, formElementsArray[1].id)}
							invalid={!formElementsArray[1].config.valid}
							shouldValidate={formElementsArray[1].config.validation}
							touched={formElementsArray[1].config.touched}
							errorMessage={formElementsArray[1].config.errorMessage}
						/>
						<span
							className={classes.passwdToggle}
							onClick={(event) => props.toggleShow(event, formElementsArray[1].id)}
						>{props.hiddenSecond ? "Show" : "Hide"}</span>
					</div>
					<button
						type="submit" 
						name="submit" 
						href="/home"
						className={cx(classes.submit, classes.action_button)}
						onClick={props.submit}
						disabled={!props.formIsValid}
					>Submit</button>
				</fieldset>
			</form>
		</div>
	)
}

export default ResetPasswordDummy;
