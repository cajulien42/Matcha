import React from 'react';

import Input from '../Input/Input';
import classes from './PasswdStrength.module.css';

class PasswdStrength extends React.Component {
	state = {
		hidden: true
	}

	toggleShow = (event) => {
		event.preventDefault()
		this.setState({ hidden: !this.state.hidden })
	}

	render() {
		this.props.password.elementConfig.type = this.state.hidden ? "password" : "text";

		return (
			<div id={classes.passwd_cont}>
				<Input
					style={this.props.style || ''}
					// className={classes.passwd}
					elementType={this.props.password.elementType}
					elementConfig={this.props.password.elementConfig}
					name={this.props.name}
					value={this.props.password.value || ''}
					changed={this.props.strengthMeter}
					invalid={this.props.invalid}
					shouldValidate={this.props.validation}
					touched={this.props.touched}
					errorMessage={this.props.errorMessage}
				/>
				<span
					className={classes.passwdButton}
					onClick={this.toggleShow.bind(this)}
				>{this.state.hidden ? "Show" : "Hide"}</span>
				<span
					className={classes.passwdStrength}
					data-score={this.props.score}
				></span>
			</div>
		)
	}
}

export default PasswdStrength
