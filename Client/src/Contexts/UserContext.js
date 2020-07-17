import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Axios from 'axios';

export const UserContext = createContext();

/** 
 *	README
 *	To create a new context element:
 *		- add a 'const/let variable_name = useState(true/false | () => { function to 
 *		choose how to in initialize variable on refresh depending on what stored in 
 *		localStorage.getItem('variable_name') });'
 *		- either creates a function that will be called to set its value, or choose 
 *		another varible that its value's changes are depending on.
 **/

const UserContextProvider = (props) => {

	const [JWT, setJWT] = useState(() => {
		const localData = localStorage.getItem('JWT');
		let token = {"token": localData};
		token = JSON.parse(localData);
		// console.log(token)
		if (token !== null && token.data.firstName) {
			let dateNow = new Date();
			if (token.exp < (dateNow.getTime() / 1000)) {
				window.location.replace("http://localhost:3000/sign-up");
				return ({data: {}, exp: 0, iat: 0, token: "" })
			}
			else {
				return (token);
			}
		}
		else {
			return ({data: {}, exp: 0, iat: 0, token: "" });
		}
	});

	const [isLoggedIn, setLog] = useState(() => {
		const localDatas = localStorage.getItem('JWT');
		const token = JSON.parse(localDatas);
		// console.log(token);
		if (token !== null) {
			let dateNow = new Date();
			if (JWT.token.exp < (dateNow.getTime() / 1000)) {
				return (false);
			}
			// token.data.firstName ? console.log("isLoggedIn initialized true"): console.log("isLoggedIn initialized false");
			return (token.data.firstName ? true : false);
		}
		else {
			return (false);
		}
	});

	const [logInPopup, setLogInPopup] = useState(false);

	const [socket, setSocket] = useState(() => {
		const localDatas = localStorage.getItem('socket');
		return (localDatas);
	});

	const [newNotif, setnewNotif] = useState(() => {
		const localDatas = localStorage.getItem('newNotif');
		const token = JSON.parse(localDatas);
		/* If there's somthing in localStorage */
		if (token !== null && token.localDatas) {
			return (token);
		}
		else {
			return ({});
		}
	});

	const parseJwt = (token) => {
		if (token !== null) {
			let base64Url = token.split('.')[1];
			let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
			return (JSON.parse(jsonPayload));
		}
		else {
			return ({data: {}, exp: 0, iat: 0, token: "" });
		}
	};

	const toggleUser = (datas) => {
		if (datas !== null) {
			if (datas.username) {
				console.log("new infos for user logged");
				let token = parseJwt(datas);
				setJWT({ data: token.data, exp: token.exp, iat: token.iat, token: datas });
			}
			else {
				console.log("new connection or parsing of token");
        		let token = parseJwt(datas);
				setJWT({ data: token.data, exp: token.exp, iat: token.iat, token: datas });
			}
		}
		else {
			console.log("log out");
			let token = parseJwt(datas);
			setJWT({ data: token.data, exp: token.exp, iat: token.iat, token: datas });
		}
	}

	const toggleLogInPopup = () => {
		console.log("toggleLogInPopup triggered");
		setLogInPopup(!logInPopup);
	}

	/* Allows HomeS.js to check if the notif is new and if not, to change it to old */
	const toggleNotifReceived = (oldNotif) => {
		const setNotifOld = oldNotif;
		setNotifOld["new"] = false;
		setnewNotif(oldNotif);
	}

	useEffect(() => {
		const mySocket = io('http://localhost:5000');
    	localStorage.setItem('JWT', JSON.stringify(JWT));
    	// console.log(localStorage.getItem('JWT', JSON.parse(JWT)));
		if (JWT.data.firstName) {
			let dateNow = new Date();
			if (JWT.token.exp < (dateNow.getTime() / 1000)) {
				setJWT({data: {}, exp: 0, iat: 0, token: "" });
			}
			mySocket.emit("loginUser", JWT.data.username);
			mySocket.emit("notification", { type: 'isOnline' });
			Axios.put(`http://localhost:4000/API/users/connect/${JWT.data.username}`, null, {headers: {"x-auth-token": JWT.token}})
			setSocket(mySocket);
			setLog(true);
			mySocket.on('notification', notification => {
				if (notification.type !== 'isOnline') {
					let newNotification = {
						emitter: notification.data.emitter,
						receiver: JWT.data.username,
						type: notification.data.type,
						new: true
					}
					console.log(newNotification);
					setnewNotif(newNotification);
				}
			});
		}
		else {
			mySocket.once('$destroy', (e) => {
				console.log(e);
				mySocket.removeAllListeners();
			})
			setLog(false);
			setSocket(null);
		}
	}, [JWT]);

	useEffect(() => {
		localStorage.setItem('isLoggedIn', isLoggedIn)
	}, [isLoggedIn]);

	useEffect(() => {
		let cache = [];
		localStorage.setItem('socket', JSON.stringify(socket, function(key, value) {
			if (typeof value === 'object' && value !== null) {
				if (cache.indexOf(value) !== -1) {
					/* Duplicate reference found, discard key */
					return;
				}
				/* Store value in our collection */
				cache.push(value);
			}
			return value;
		}));
		/* Enable garbage collection */
		cache = null;
	}, [socket]);

	useEffect(() => {
		localStorage.setItem('newNotif', JSON.stringify(newNotif) )
	}, [newNotif]);

	return (
		<UserContext.Provider 
			value={{ 
				JWT, 
				isLoggedIn,
				newNotif,
				socket,
				toggleUser,
				logInPopup,
				toggleLogInPopup,
				toggleNotifReceived
			}} 
		>
			{props.children}
		</UserContext.Provider>
	);
}

export default UserContextProvider;
