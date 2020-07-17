import React from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import cx from 'classnames';

import classes from './Search.module.css';
import Tags from '../Utils/Tags/Tags';
import MapContainer from '../Geolocalisation/MapContainer';
import UserIcon from '../Home/UserIcon/UserIcon';
import UserPage from '../Home/UserPage/UserPageS';
import AlertBox from '../Utils/AlertBox/AlertBox';

const SearchDummy = (props) => {
	const ageRange = props.JWT.data.ageMin ? [props.JWT.data.ageMin, props.JWT.data.ageMax] : props.ageRange;
	const localisation = props.JWT.data.localisation ? props.JWT.data.localisation : props.localisation; 

	return (
		<div>
			<div className={classes.main}>
				<div className={classes.searchPart} id="main" >
					{props.alertBox ?
						<AlertBox
							message={props.alertBox.message}
							button={props.alertBox.button}
							handleChange={props.handleChange}
							color={props.alertBox.color}
							function={props.alertBox.function}
							style={{margin: '0 auto', top: '30%', zIndex:'2000', left: '40%'}}
						/>
						: null
					}
					<div className={classes.filters}>
						<h3>Filters</h3>
						<div className={classes.border}>
							<div className={classes.elemCont} >
								<div className={classes.filtersCont}>
									<div className={classes.firstRow}>
										<div className={classes.step3}>
											<h3 className={classes.questionsS3}>Maximum Distance</h3>
											<h4 className={classes.values}>{props.localisation}km</h4>
											<Slider
												min={3}
												max={160}
												defaultValue={localisation}
												count={1}
												onChange={props.handleLocation}
											/>
										</div>
										<div className={classes.step3}>
											<h3 className={classes.questionsS3}>Age Range</h3>
											<h4 className={classes.values}>{props.ageRange[0]} - {props.ageRange[1]}</h4>
											<Range
												min={18}
												max={100}
												defaultValue={ageRange}
												count={1}
												pushable={true}
												onChange={props.handleAgeRange}
											/>
										</div>
										<div className={classes.step3}>
											<h3 className={classes.questionsS3}>Popularity</h3>
											<h4 className={classes.values}>{props.popularityRange[0]}% - {props.popularityRange[1]}%</h4>
											<Range
												min={0}
												max={100}
												defaultValue={props.popularityRange}
												count={5}
												pushable={true}
												onChange={props.handlePopularityRange}
											/>
										</div>
										<Tags
											title="Tags"
											styling={true}
											divclassname={classes.step3}
											h3classname={classes.questionsS3}
											tags={props.tags}
											handleDelete={props.handleDelete}
											handleAddition={props.handleAddition}
										/>
										<button onClick={props.submit} className={classes.submit}><i className={cx(classes.angle, "fas fa-angle-right")}></i></button>
									</div>
									<div className={classes.secondRow}>
										<div className={classes.geolocCont} >
											<MapContainer 
												className={classes.map} 
												suggestions={props.suggestionsSearched}
												currentLocation={props.currentLocation} 
												rerender={props.rerender} 
											/>
											{props.JWT.data.complete === "false" ?
												<div className={classes.pos}><i className={cx("fas fa-map-marked-alt", classes.geolocate)} style={{cursor: 'not-allowed'}}></i></div>
												: props.clicked === true ?
													<div className={classes.pos}><i className={cx("fas fa-map-marked-alt", classes.geolocate)} ></i></div>
													: <div className={classes.pos}><i className={cx("fas fa-map-marked-alt", classes.geolocate)} onClick={e => {props.geolocateUser(e)}}></i></div>
											}
										</div>
										<div className={classes.filterBy} >
											<h4>Filter by...</h4>
											<div className={classes.optionsCont}>
												{props.filters.map( (elem, i) => (
													<div key={i}>
														<input
															className={classes.radio}
															id={elem.id}
															type="radio"
															value={elem.value}
															name="filterBy"
															onChange={(event) => props.handleFilterBy(event, elem.id)}
															checked={props.filterBy === elem.value}
														/>
														<label htmlFor={elem.id} className={classes.label}>
															{elem.displayValue}
														</label>
													</div>
												))}
											</div>
										</div>
									</div>
									<div className={classes.searchbarCont}>
									{props.JWT.data.complete === "false" ?
										<input 
											className={classes.searchbar}
											type="text"
											value={props.searchbar}
											name="searchbar"
											placeholder="Who are you looking for ?"
											onChange={props.handleSearch}
											disabled
										/>
										: <input 
											className={classes.searchbar}
											type="text"
											value={props.searchbar}
											name="searchbar"
											placeholder="Who are you looking for ?"
											onChange={props.handleSearch}
										/>
									}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={classes.wrapper}>
					{props.suggestionsSearched ?
						props.suggestionsSearched.map((elem, i) => {
							return (
								<UserIcon
									{...elem}
									key={i}
									popupUser={e => props.popupUser(e, i)}
									id={i}
								/>)
						})
						: null
					}
				</div>
			</div>
			{props.suggestionsSearched ?
				props.suggestionsSearched.map((elem, i) => {
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

export default SearchDummy;
