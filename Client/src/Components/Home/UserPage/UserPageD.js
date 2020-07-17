import React from 'react';
import cx from 'classnames';

import classes from './UserPage.module.css';
import Hashtag from '../../../Icons/hashtag';
import AlertBox from '../../Utils/AlertBox/AlertBox';

const UserPageDumb = (props) => {
	// console.log(props);

	/* Formatting last active status known into time for display */
	let time = null;
	if (props.user.lastConnection) {
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
		const lastConnection = new Date(props.user.lastConnection).getTime() + 3600000;
		/* Date of last connection */
		let dateLastConnect = new Date(props.user.lastConnection).toLocaleDateString();

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

	/* Picking the right gender icon to display */
	let genderIcon = null;
	if (props.user.gender === "male") {
		genderIcon = "fas fa-mars";
	}
	else if (props.user.gender === "female") {
		genderIcon = "fas fa-venus";
	}
	else if (props.user.gender === "queer") {
		genderIcon = "fas fa-transgender";
	}

	/* Formatting data for display */
	let sexOrient = null;
	if (props.user.sexOrient === "bi") {
		sexOrient = "Bisexual";
	}
	else if (props.user.sexOrient === "hetero") {
		sexOrient = "Heterosexual";
	}
	else if (props.user.sexOrient === "pan") {
		sexOrient = "Pansexual";
	}

	/* Formatting data for display */
	let gender = null;
	if (props.user.gender === "male") {
		gender = "Male";
	}
	else if (props.user.gender === "female") {
		gender = "Female";
	}
	else if (props.user.gender === "genderQueer") {
		gender = "Queer";
	}

	const handleClickOutside = (e) => {
		e.preventDefault();
		if (e.target.classList.contains("underDiv")) {
			const id = e.target.id;
			const users = document.querySelectorAll('.back');
			const underDiv = document.querySelectorAll('.underDiv');
			users[id].style.display = "none";
			underDiv[id].style.display = "none";
			document.getElementById("main").style.filter = 'blur(0)'
		}
	}

	// console.log(props);
	return (
		<div className={cx(classes.underDiv, "underDiv")} onClick={handleClickOutside} id={props.id}>
			{props.alertBox ?
				<AlertBox
					message={props.alertBox.message}
					button={props.alertBox.button}
					handleChange={props.handleChange}
					color={props.alertBox.color}
					function={true}
					logIn={true}
					style={{position: 'fixed', top: '65%'}}
				/>
				: null
			}
			<div className={cx(classes.bubble, "back", classes.back)} id={props.id}>
				<div className={classes.left}>
					<div className={classes.leftTopGroup} >
						<div className={classes.photos}>
							{/* If there are photos, assemble it. Else, put an icon */
							props.user.photos ?
								props.user.photos.map((elem, i) => (
									/* If it's the first photo, put it up front, else put it behind with no display */
									i === 0 ?
									<img className={cx(classes.profilPicFront, "profilPic", "profilPicFront")} src={elem} alt="profil" key={i} id={i} />
									: <img className={cx(classes.profilPicBack, "profilPic")} src={elem} alt="profil" key={i} id={i} />
								))
								: <i className={cx(classes.profilPicFront, "fas fa-user-circle", classes.icon)} id={0} ></i> 
							}
						</div>
						<div className={classes.dotGroup}>
							{props.user.photos ?
								props.user.photos.map((elem, i) => {
									/* If it's there's at least 2 photos, create first dot as the active one */
									if (i === 0 && props.user.photos[1]) {
										return (<div 
													className={cx(classes.dotFront, classes.dot, "dot", "dotFront")} 
													key={i} 
													id={i} 
													onClick={(event) => props.handleThisPic(event, i)}
												></div>);
									}
									/* If there's only one photo, don't create a dot */
									else if (i === 0 && !props.user.photos[1]) {
										return (null);
									}
									/* For as long as there are photos and it's not the first one, create clickable dots */
									else { 
										return (<div 
													className={cx(classes.dotBack, classes.dot, "dot")} 
													key={i} 
													id={i}
													onClick={(event) => props.handleThisPic(event, i)}
												></div>);
								}})
								: null
							}
						</div>
						<div className={classes.statusGroup}>
							{/* {console.log(props)} */}
							{props.usersOnline ?
								props.usersOnline[props.user.username] === true ?
									<div className={cx(classes.active, classes.statusCircle)}></div>
									: <div className={cx(classes.inactive, classes.statusCircle)}></div>
								: <div className={cx(classes.inactive, classes.statusCircle)}></div>
							}
							{props.user.lastConnection ?
								props.usersOnline ?
									props.usersOnline[props.user.username] === true ?
									<h5 className={classes.status}>Online</h5>
									: <h5 className={classes.status}>Active {time} ago</h5>
								: <h5 className={classes.status}>Active {time} ago</h5>
							: <h5 className={classes.status}>Inactive</h5>
							}
						</div>
					</div>
					<div className={classes.leftBottomGroup}>
						<div className={classes.cercle}>
							<div className={classes.matchIndicator}>
								<h3 className={classes.percentage}>{props.user.popularity} <i className="fas fa-percentage"></i></h3>
								<h3 className={classes.popularity}>popularity</h3>
							</div>
						</div>
					</div>
				</div>
				<div className={classes.right}>
					<div className={classes.rightTop}>
						<div className={classes.basicInfos}>
							<h3>{props.user.firstName} {props.user.lastName}</h3>
							<h4 className={classes.usernameAge}>{props.user.username}, {props.user.age} yo</h4>
							<h4 className={classes.genderSex}><i className={cx(genderIcon, classes.genderIcon)}></i>{gender}, {sexOrient}</h4>
						</div>
						{/* Conditional rendering depending on if user liked the profil he/she's consulted and on if the profil liked him/her back  */}
						<div className={classes.heartGroup}>
							{props.addClass ? 
								<i className={cx(classes.empty_heart, props.addClass, "empty_heart")} id={props.id} onClick={props.handleHeartClick} ></i>
								: props.user.Uliked ?
									<i className={cx(classes.empty_heart, "fas fa-heart", "empty_heart")} id={props.id} onClick={props.handleHeartClick} ></i>
									: <i className={cx(classes.empty_heart, "far fa-heart", "empty_heart")} id={props.id} onClick={props.handleHeartClick} ></i>
							}
							{props.user.likedU ?
								<h6>{props.user.username} liked you!</h6>
								: null
							}
						</div>
					</div>
					<div className={classes.rightMiddle}>
						<i className={cx("fas fa-quote-left", classes.left_quote)}></i>
						<div className={classes.bioCont}>
							<div className={classes.IAm}>
								<h5>I am...</h5>
								<div className={classes.tagContIAm}>
									{props.user.isTags.map((elem, i) => (
										<span key={i} className={classes.price_tag}>
											<Hashtag className={classes.hash}/> 
											{elem.text}
										</span>
									))}
								</div>
							</div>
							<div className={classes.bio}>
								<h4>{props.user.bio}</h4>
							</div>
							<div className={classes.lookingFor}>
								<h5>I'm interested In...</h5>
								<div className={classes.tagContInterest}>
									{props.user.lookTags.map((elem, i) => (
										<span key={i} className={classes.price_tag}>
											<Hashtag className={classes.hash}/> 
											{elem.text}
										</span>
									))}
								</div>
							</div>
						</div>
						<i className={cx("fas fa-quote-right", classes.right_quote)}></i>
					</div>
					<div className={classes.rightBottom}>
						<div className={classes.problemsCont}>
							<button 
								className={cx(classes.block, "block")}
								onClick={props.handleBlock}
							>
								<i className="fas fa-user-slash"></i>
								<h5>Block</h5>
							</button>
							<div 
								className={cx(classes.fake, "fake")}
								onClick={props.handleFake}
							>
								<i className="fas fa-bullhorn"></i>
								<h5>Fake</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserPageDumb;
