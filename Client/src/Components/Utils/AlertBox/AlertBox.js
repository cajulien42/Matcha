import React, { Component } from 'react';

import classes from './AlertBox.module.css';
import { UserContext } from '../../../Contexts/UserContext';

class AlertBox extends Component {
	static contextType = UserContext;

	render() {
		// console.log(this.props);
		return (
			this.props.color === "red" ?
			<div id={classes.error_box} style={this.props.style}>
				<div className={classes.dot}></div>
				<div className={`${classes.dot} ${classes.two}`}></div>
				<div className={classes.face2}>
					<div className={classes.eye}></div>
					<div className={`${classes.eye} ${classes.right}`}></div>
					<div className={`${classes.mouth} ${classes.sad}`}></div>
				</div>
				<div className={`${classes.shadow} ${classes.move}`}></div>
				<div className={classes.message}>
					<h1 className={`${classes.alert} ${classes.h1}`}>Error!</h1>
					<p className={classes.p}>{this.props.message}</p>
				</div>
				<button 
					className={`${classes.button_box} ${classes.button}`}
					onClick={this.props.handleChange}
				>
					<h1 className={classes.red}>{this.props.button}</h1>
				</button>
			</div>
			:
			<div id={classes.success_box} style={this.props.style}>
				<div className={classes.dot}></div>
				<div className={`${classes.dot} ${classes.two}`}></div>
				<div className={classes.face}>
					<div className={classes.eye}></div>
					<div className={`${classes.eye} ${classes.right}`}></div>
					<div className={`${classes.mouth} ${classes.happy}`}></div>
				</div>
				<div className={`${classes.shadow} ${classes.scale}`}></div>
				<div className={classes.message}>
					<h1 className={`${classes.alert} ${classes.h1}`}>Success!</h1>
					<p className={classes.p}>{this.props.message}</p>
				</div>
				{this.props.function ? 
						<a
							href="/"
							className={`${classes.button_box} ${classes.button}`}
							onClick={(event) => {
								event.preventDefault();
								this.context.toggleLogInPopup();
								this.props.handleChange(event, "go to log in");
								if (document.getElementById("display_page") !== null) { 
									document.getElementById("display_page").style.filter = ''
								}
							}} >
							<h1 className={classes.green}>{this.props.button}</h1>
						</a>
					: <a
						className={`${classes.button_box} ${classes.button}`}
						onClick={this.props.handleChange}
						href="/"
					>
						<h1 className={classes.green}>{this.props.button}</h1>
					</a>
				}
			</div>
		)
	}
}

export default AlertBox
