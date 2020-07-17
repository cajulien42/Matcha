// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Redirect } from "react-router-dom"

import { UserContext } from '../Contexts/UserContext';

const PrivateRoute = ({component: Component, ...rest}) => {
	const { isLoggedIn } = useContext(UserContext);
	const { JWT } = useContext(UserContext);
	
	if (JWT.token !== null && JWT.data.firstName) {
		let dateNow = new Date();
		// console.log(JWT.exp);
		// console.log(dateNow.getTime() / 1000);
		if (JWT.exp < (dateNow.getTime() / 1000)) {
			this.context.toggleUser(null);
		}
	}

	return (
		<Route 
			{...rest}
			render={props => {
				const path = props.location.pathname.split("/");
				// console.log(path[1]);
				// console.log("isLoggedIn: " + isLoggedIn + " & Component is " + Component.name)
				if (isLoggedIn === true && Component.name !== "SignUp" && path[1] !== "reset_password") {
					return (<Component {...props} />) ;
				}
				else if (isLoggedIn === true && Component.name === "SignUp") {
					return (<Redirect to={{pathname: '/home', state:{from: props.location }}} />);
				}
				else if (isLoggedIn === false && Component.name === "SignUp") {
					return (<Component {...props} />);
				}
				else if (isLoggedIn === false && path[1] === "reset_password") {
					return (<Component {...props} />);
				}
				else if (isLoggedIn === true && path[1] === "reset_password") {
					return (<Redirect to={{pathname: '/home', state:{from: props.location }}} />);
				}
				else if (isLoggedIn === false && path[1] === "confirm") {
					return (<Component {...props} />);
				}
				else if (isLoggedIn === true && path[1] === "confirm") {
					return (<Redirect to={{pathname: '/home', state:{from: props.location }}} />);
				}
				else if (isLoggedIn === false && Component.name === "SendMailResetSmart") {
					return (<Component {...props} />);
				}
				else if (isLoggedIn === true && Component.name === "SendMailResetSmart") {
					return (<Redirect to={{pathname: '/home', state:{from: props.location }}} />);
				}
				else { 
					return (<Redirect to={{pathname: '/sign-up', state:{from: props.location }}} />)
				}
			}}
		/>
	)
}

export default PrivateRoute;
