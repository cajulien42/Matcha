import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import classes from './NavBar.module.css';
import Login from '../Forms/LogIn/LoginS';

const NavBarDummy = (props) => {
//   console.log(props.unreadMessages)
	return (
		<div className={classes.conteneur}>
				<div className={classes.NavBar}>
					<Link to="/home">
						<li className={classes.logo}>
							<h1>Matcha
								{/* <i className="fas fa-puzzle-piece" /> Matcha */}
							</h1>
						</li>
					</Link>
					{props.isLoggedIn === false ?
						<Login />
						:
						[<div key={1} className={classes.wrapper}>
							<h4 className={classes.username}>Welcome back {props.JWT.data.username} !</h4>
							<div className={classes.buttons}>
								<Link 
									to="/account" 
									className={cx(classes.sidebarLogged, "btn-sm")}
								>Account</Link>
								<button 
									className={cx(classes.sidebarLogged, "btn-sm")}
									onClick={props.logOut.bind(this)}
									href="/"
								>Log Out</button>
							</div>
						</div>]
					}
				</div>
				{props.isLoggedIn === true ?
				<div className={classes.options}>
					<div className={classes.left}>
						<Link
							to="/profil"
							className={classes.profil}
						><i className="fas fa-user-circle"></i> Profil</Link>
						<Link
							to="/matches"
							className={classes.matches}
						><i className="fas fa-bolt"></i> Matches</Link>
						<Link
							to="/messages"
							className={classes.messages}
						>
							<i className="far fa-envelope"></i> 
							{props.unreadMessages > 0 ?
							[<div className={classes.unreadMessages} key={0} >
								{props.unreadMessages}
							</div>]
							: null
							}
							Messages
						</Link>
						<Link
							to="/search"
							className={classes.search}
						><i className="fab fa-searchengin"></i> Search</Link>
					</div>
					<div className={classes.right}>
						<button
							className={classes.showNotifs}
							onClick={props.showNotifs.bind(this)}
						>
							<i className="far fa-bell"></i>
							{ props.unreadNotifs > 0 ?
								[<div className={classes.unreadNotifs} key={0} >
									{props.unreadNotifs}
								</div>]
								: null
							}
						</button>
						{ props.displayNotifs === true ?
							[<div className={classes.notifs} key={0}>
								{!props.notifications[0] ?
								[<div id={0} key={0} className={classes.notification} >
									You currently have no notification to display.
								</div>]
								: props.notifications.map((elem, i) => {
									// console.log(props.notifications)
									// console.log(elem);
									let style = null;
									if (elem.read === "false") {
										style = { fontWeight: '600', color: '#ff665e' };
									}
									let action = null;
									if (elem.type === "visit") {
										action = "has consulted your profil";
									}
									else if (elem.type === "like") {
										action = "liked you";
									}
									else if (elem.type === "match") {
										action = "You have a new match with";
									}
									else if (elem.type === "unmatch") {
										action = "are no longer a match...";
									}
									if (elem.type === "match") {
										return (
											<div id={i} key={i} className={classes.notification} onClick={(e) => props.handleNotifClick(e, i)} style={style} >
												{elem.emitter.photos[0] ?
													<img src={elem.emitter.photos[0]} alt="profil" className={classes.profilPic}/>
													: <i className={cx(classes.profilPic, "fas fa-user-circle")} ></i> 
												}
												{action} {elem.emitter.username}!
											</div>
										)
									}
									else if (elem.type === "unmatch") {
										return (
											<div id={i} key={i} className={classes.notification} onClick={(e) => props.handleNotifClick(e, i)} style={style} >
												{elem.emitter.photos[0] ?
													<img src={elem.emitter.photos[0]} alt="profil" className={classes.profilPic}/>
													: <i className={cx(classes.profilPic, "fas fa-user-circle")} ></i> 
												}
												You and {elem.emitter.username} {action}
											</div>
										)
									}
									else {
										return (
											<div id={i} key={i} className={classes.notification} onClick={(e) => props.handleNotifClick(e, i)} style={style} >
												{elem.emitter.photos[0] ?
													<img src={elem.emitter.photos[0]} alt="profil" className={classes.profilPic}/>
													: <i className={cx(classes.profilPic, "fas fa-user-circle")} ></i> 
												}
												{elem.emitter.username} {action}
											</div>
										)
									}
								})}
							</div>]
							: null
						}
					</div>
				</div>
				: null}
			</div>
	)
}

export default NavBarDummy;
