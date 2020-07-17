import React from 'react';
import cx from 'classnames';

import classes from './Matches.module.css';

const MatchesDummy = (props) => {
	return (
		<div className={classes.main}>
			<div className={classes.container}>
				<div className={classes.matchesList}>
					<h2>Matches</h2>
					{props.matchesList[0] ?
						props.matchesList.map((elem, i) => {
							let isOnline = false;
							if (props.usersOnline) {
								for (let i = 0; i < props.usersOnline.length; i++) {
									if (props.usersOnline[i].name === elem.user.username) {
										isOnline = true;
									}
								}
							}
							/* Formatting match happened how long ago for display */
							let time = null;
							if (elem.matchCreation) {
								/* timestamp for now */
								const timestamp = Date.now();
							
								/* date and time of now */
								const now = new Date(timestamp);
								/* Date of now */
								let dateNow = new Date(now).toLocaleDateString();
								// var hours1 = now.getHours();
								// var minutes1 = "0" + now.getMinutes();
								// var seconds1 = "0" + now.getSeconds();
								/* time for now */
								// var formattedTime1 = hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
							
								/* timestamp of last connection */
								const lastConnection = new Date(elem.matchCreation).getTime() + 3600000;
								/* Date of last connection */
								let dateLastConnect = new Date(elem.matchCreation).toLocaleDateString();
							
								if (dateNow === dateLastConnect) {
									/* timestamp of time elapsed */
									const timeElapsed = now - lastConnection;
								
									let date = new Date(timeElapsed);
									/* time of time elapsed */
									// let timeString = date.toTimeString();
									var hours = date.getHours();
									var minutes = "0" + date.getMinutes();
									var seconds = "0" + date.getSeconds();
									if (hours > 0) {
										if (hours === 1) {
											time = hours + " hour";
										}
										else {
											time = hours + ' hours';
										}
									}
									else if (hours <= 0 && minutes > 0) {
										if (minutes === 1) {
											time = minutes.toString().substr(-2) + " minute";
										}
										else {
											time = minutes.toString().substr(-2) + ' minutes';
										}
									}
									else if (hours <= 0 && minutes <= 0 && seconds > 0) {
										if (seconds === 1) {
											time = seconds.toString().substr(-2) + " second";
										}
										else {
											time = seconds.toString().substr(-2) + ' seconds';
										}
									}
								}
								else {
									const dateNowArray = dateNow.split('/');
									const dateLastConnectArray = dateLastConnect.split('/');
									const daysElapsed = dateNowArray[0] - dateLastConnectArray[0];
									const monthElapsed = dateNowArray[1] - dateLastConnectArray[1];
									const yearsElapsed = dateNowArray[2] - dateLastConnectArray[2];
									if (dateNowArray[0] > dateLastConnectArray[0]) {
										if (daysElapsed === 1) {
											time = daysElapsed + " day";
										}
										else {
											time = daysElapsed + ' days';
										}
									}
									else if (daysElapsed <= 0 && monthElapsed > 0) {
										if (monthElapsed === 1) {
											time = monthElapsed.toString().substr(-2) + " month";
										}
										else {
											time = monthElapsed.toString().substr(-2) + ' months';
										}
									}
									else if (daysElapsed <= 0 && monthElapsed <= 0 && yearsElapsed > 0) {
										if (yearsElapsed === 1) {
											time = yearsElapsed.toString().substr(-2) + " year";
										}
										else {
											time = yearsElapsed.toString().substr(-2) + ' years';
										}
									}
								}
							}
							return (
								<div className={classes.match} key={i}>
									<div className={classes.mainInfos}>
										<img src={elem.user.photos[0]} alt="profil" />
										<div className={classes.textInfos}>
											<div className={classes.name}>{elem.user.username}</div>
											<div className={classes.matchTime}>Match happened {time} ago</div>
										</div>
									</div>
									<div className={classes.subInfos}>
										{isOnline ?
											[<div className={classes.onlineCont} key={0}>
												<div className={classes.onlineDot}></div> Active
											</div>]
											: <p className={classes.lastConnect}>last active: <br /> {elem.user.lastConnection}</p>
										}
									</div>
								</div>
							)
						})
						: <div className={classes.match} key={0}>
							<div className={classes.mainInfos}>
								<i className={cx(classes.icon, "fas fa-user-circle")}></i> 
								<div className={classes.textInfos}>
									<div className={classes.name}>Username</div>
									<div className={classes.matchTime}>Match happened ... ago</div>
								</div>
							</div>
							<div className={classes.subInfos}>
								<p className={classes.lastConnect}>last active: <br /> Today</p>
							</div>
						</div>
					}
				</div>
				<div className={classes.visitsHistoric}>
					<h2>Visits & Likes Historic</h2>
					{props.visits_likesHistoric[0] ?
						props.visits_likesHistoric.map((elem, i) => {
							let isOnline = false;
							if (props.usersOnline) {
								for (let i = 0; i < props.usersOnline.length; i++) {
									if (elem.user && props.usersOnline[i].name === elem.user.username) {
										isOnline = true;
									}
								}
							}
							/* Formatting match happened how long ago for display */
							let time = null;
							if (elem.date) {
								/* timestamp for now */
								const timestamp = Date.now();
							
								/* date and time of now */
								const now = new Date(timestamp);
								/* Date of now */
								let dateNow = new Date(now).toLocaleDateString();
								// var hours1 = now.getHours();
								// var minutes1 = "0" + now.getMinutes();
								// var seconds1 = "0" + now.getSeconds();
								/* time for now */
								// var formattedTime1 = hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
							
								/* timestamp of last connection */
								const lastConnection = new Date(elem.date).getTime() + 3600000;
								/* Date of last connection */
								let dateLastConnect = new Date(elem.date).toLocaleDateString();
							
								if (dateNow === dateLastConnect) {
									/* timestamp of time elapsed */
									const timeElapsed = now - lastConnection;
								
									let date = new Date(timeElapsed);
									/* time of time elapsed */
									// let timeString = date.toTimeString();
									var hours = date.getHours();
									var minutes = "0" + date.getMinutes();
									var seconds = "0" + date.getSeconds();
									if (hours > 0) {
										if (hours === 1) {
											time = hours + " hour";
										}
										else {
											time = hours + ' hours';
										}
									}
									else if (hours <= 0 && minutes > 0) {
										if (minutes === 1) {
											time = minutes.toString().substr(-2) + " minute";
										}
										else {
											time = minutes.toString().substr(-2) + ' minutes';
										}
									}
									else if (hours <= 0 && minutes <= 0 && seconds > 0) {
										if (seconds === 1) {
											time = seconds.toString().substr(-2) + " second";
										}
										else {
											time = seconds.toString().substr(-2) + ' seconds';
										}
									}
								}
								else {
									const dateNowArray = dateNow.split('/');
									const dateLastConnectArray = dateLastConnect.split('/');
									const daysElapsed = dateNowArray[0] - dateLastConnectArray[0];
									const monthElapsed = dateNowArray[1] - dateLastConnectArray[1];
									const yearsElapsed = dateNowArray[2] - dateLastConnectArray[2];
									if (dateNowArray[0] > dateLastConnectArray[0]) {
										if (daysElapsed === 1) {
											time = daysElapsed + " day";
										}
										else {
											time = daysElapsed + ' days';
										}
									}
									else if (daysElapsed <= 0 && monthElapsed > 0) {
										if (monthElapsed === 1) {
											time = monthElapsed.toString().substr(-2) + " month";
										}
										else {
											time = monthElapsed.toString().substr(-2) + ' months';
										}
									}
									else if (daysElapsed <= 0 && monthElapsed <= 0 && yearsElapsed > 0) {
										if (yearsElapsed === 1) {
											time = yearsElapsed.toString().substr(-2) + " year";
										}
										else {
											time = yearsElapsed.toString().substr(-2) + ' years';
										}
									}
								}
							}
							const type = elem.type === "like" ? 'Like' : 'Visit';
							if (elem.user) {
								return (
									<div className={classes.match} key={i}>
										<div className={classes.mainInfos}>
											<img src={elem.user.photos[0]} alt="profil" />
											<div className={classes.textInfos}>
												<div className={classes.name}>{elem.user.username}</div>
												<div className={classes.matchTime}>{type} was {time} ago</div>
											</div>
										</div>
										<div className={classes.subInfos}>
											{isOnline ?
												[<div className={classes.onlineCont} key={0}>
													<div className={classes.onlineDot}></div> Active
												</div>]
												: <p className={classes.lastConnect}>last active: <br /> {elem.user.lastConnection}</p>
											}
										</div>
									</div>
								)
							}
							else {
								return (null)
							}
						})
						: <div className={classes.match} key={0}>
							<div className={classes.mainInfos}>
								<i className={cx(classes.icon, "fas fa-user-circle")}></i> 
								<div className={classes.textInfos}>
									<div className={classes.name}>Username</div>
									<div className={classes.matchTime}>Visit/Like was ... ago</div>
								</div>
							</div>
							<div className={classes.subInfos}>
								<p className={classes.lastConnect}>last active: <br /> Today</p>
							</div>
						</div>
					}
				</div>
			</div>
			{!props.matchesList[0] ?
				!props.visits_likesHistoric[0] ?
					<div className={classes.nothing}>You don't have any activity yet. Time to browse around !</div>
					: null
				: null
			}
		</div>
	)
}

export default MatchesDummy;
