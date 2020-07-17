import React from 'react';

import classes from './Home.module.css';
import UserIcon from './UserIcon/UserIcon';
import UserPage from './UserPage/UserPageS';
import MapContainer from '../Geolocalisation/MapContainer';

const HomeDumb = (props) => {
	// console.log(props.JWT.data.complete);
	const complete = props.JWT.data.complete === "false" ? null : true;

	return (
		<div>
			{props.JWT.data.username ?
				complete === null ?
					[<div className={classes.uncompleteUser} key={0}>
						<p>Your profil is incomplete. PLease fill out the missing fields to access to your suggestions</p>
					</div>]
					: [<div className={classes.main} id="main" key={0}>
						<div className={classes.geolocCont} >
							<MapContainer displayInput={props.displayInput} suggestions={props.suggestions} currentLocation={{lat: props.JWT.data.lat, lon:props.JWT.data.lon}}/>
						</div>
						<div className={classes.wrapper}>
							{props.suggestions !== null ?
								props.suggestions.map((elem, i) => {
									return (<UserIcon 
										{...elem} 
										key={i}
										popupUser={props.popupUser}
										id={i}
									/>)}
								)
								: <div className={classes.noSuggestions}>
									We have currently no user to connect you with. Maybe change your filters ?
								</div>
							}
						</div>
					</div>]
				: null
			}
			{props.suggestions !== null ?
				props.suggestions.map((elem, i) => {
					return(<UserPage 
						{...elem} 
						key={i}
						id={i}
						name="back"
						usersOnline={props.usersOnline}
					/>)}
				)
				: null
			}
		</div>
	)
}

export default HomeDumb;
