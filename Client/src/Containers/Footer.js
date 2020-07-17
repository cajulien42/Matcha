import React, { useContext } from 'react';

import classes from './Footer.module.css';
import { UserContext } from '../Contexts/UserContext';

const Footer = () => {
	const { isLoggedIn } = useContext(UserContext);
	const style = isLoggedIn ? { backgroundColor: 'rgb(116, 209, 234)', color: 'white'} : null;

	return (
	<div className={classes.footer} style={style}>
		<p style={style}>© 42 psentilh & cajulien, 2019</p>
	</div>
	)
}

export default Footer;
