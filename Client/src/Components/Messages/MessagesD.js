import React from 'react';
import cx from 'classnames';

import classes from './Messages.module.css';
import Input from '../Utils/Input/Input';

const MessagesDummy = (props) => {
	const user = props.JWT.data;
	console.log(props.matchList)
	return (
		<div className={classes.main}>
			<div className={classes.usersList}>
				{props.matchList ?
					props.matchList.map((elem, i) => {
						if (elem.unreadMessages[0].id !== null || (elem.unreadMessages[0].id !== null && elem.unreadMessages[0].notif.read === "false")) {
							return (
								<div key={i} className={classes.userDiv} id={elem.user.username} onClick={(e) => props.getConversation(e, elem.user.username)} >
									<img src={elem.user.photos[0]} alt="profil" className={classes.photo} />
									<div className={classes.names}>{elem.user.firstName} {elem.user.lastName}</div>
									<div className={classes.unreadMessages} key={i}></div>
								</div>
							)
						}
						else if (elem.isRead === true) {
							return (
								<div key={i} className={classes.userDiv} id={elem.user.username} onClick={(e) => props.getConversation(e, elem.user.username)} >
									<img src={elem.user.photos[0]} alt="profil" className={classes.photo} />
									<div className={classes.names}>{elem.user.firstName} {elem.user.lastName}</div>
								</div>
							)
						}
						else return (
							<div key={i} className={classes.userDiv} id={elem.user.username} onClick={(e) => props.getConversation(e, elem.user.username)} >
								<img src={elem.user.photos[0]} alt="profil" className={classes.photo} />
								<div className={classes.names}>{elem.user.firstName} {elem.user.lastName}</div>
							</div>
						)
					})
					: null
				}
			</div>
			<div className={classes.messages}>
				<div className={classes.messagesList}>
					{props.messagesList ?
						props.messagesList.map((elem, i) => {
							if (elem.notif.emitter !== user.username && elem.notif.emitter !== "admin") {
								if (props.messagesList[i + 1] !== undefined) {
									return (
										<div className={classes.takePlaceLeft} key={i} >
											<blockquote className={classes.speech_bubble}>
												<p>{elem.notif.message}</p>
												<cite>{elem.notif.date}</cite>
											</blockquote>
										</div>
									);
								}
								else {
									return (
										<div className={cx(classes.takePlaceLeft, classes.lastMessage)} key={i} >
											<blockquote className={classes.speech_bubble}>
												<p>{elem.notif.message}</p>
												<cite>{elem.notif.date}</cite>
											</blockquote>
										</div>
									)
								}
							}
							else if (elem.notif.emitter === user.username && elem.notif.emitter !== "admin") {
								if (props.messagesList[i + 1] !== undefined) {
									return (
										<div className={classes.takePlaceRight} key={i} >
											<blockquote className={cx(classes.speech_bubbleSent)}>
												<p>{elem.notif.message}</p>
												<cite>{elem.notif.date}</cite>
											</blockquote>
										</div>
									);
								}
								else {
									return (
										<div className={cx(classes.takePlaceRight, classes.lastMessage)} key={i} >
											<blockquote className={cx(classes.speech_bubbleSent)}>
												<p>{elem.notif.message}</p>
												<cite>{elem.notif.date}</cite>
											</blockquote>
										</div>
									)
								}
							}
							else {
								return (
									<div className={classes.noMessage} key={i}>
										{elem.notif.message}
									</div>
								)
							}
						})
						: null
					}
				</div>
			</div>
			{props.activeDiv ?
					[<div 
						className={classes.sendBar} 
						key={0} 
						onKeyDown={e => {
							if (e.keyCode === 13) {
								props.sendMessage(e)
							}
						}}
					>
						<Input
							id="sendBar"
							key={props.sendBar.title}
							elementType={props.sendBar.elementType}
							elementConfig={props.sendBar.elementConfig}
							value={props.sendBar.value}
							changed={(event) => props.inputChangedHandler(event, props.sendBar.title)}
							invalid={!props.sendBar.valid}
							shouldValidate={props.sendBar.validation}
							touched={props.sendBar.touched}
							errorMessage={props.sendBar.errorMessage}
						/>
						<i className={cx("fas fa-paper-plane", classes.send)} onClick={props.sendMessage}></i>
					</div>]
					: null
			}
		</div>
	)
}

export default MessagesDummy;
