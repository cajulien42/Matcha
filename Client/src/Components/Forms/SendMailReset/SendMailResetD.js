import React from 'react';
import cx from 'classnames';

import classes from './SendMailReset.module.css';
import AlertBox from '../../Utils/AlertBox/AlertBox';
import Input from '../../Utils/Input/Input';

const SendMailResetDummy = (props) => {
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
					<h3 className={classes.fs_subtitle}>Enter your e-mail and we'll send you a link to reset your password</h3>
					<Input
						key="username"
						elementType={props.username.elementType}
						elementConfig={props.username.elementConfig}
						value={props.username.value}
						changed={(event) => props.inputChangedHandler(event, props.username.id)}
						invalid={!props.username.valid}
						shouldValidate={props.username.validation}
						touched={props.username.touched}
						errorMessage={props.username.errorMessage}
					/>
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

export default SendMailResetDummy;
