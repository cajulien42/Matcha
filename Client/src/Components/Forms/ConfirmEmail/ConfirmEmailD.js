import React from 'react';

import classes from './ConfirmEmail.module.css';

const ConfirmEmailDummy = (props) => {
	return (
		<div className={classes.main}>
			<div className={classes.form}>
				{props.wrongLink ?
					<p className={classes.wrongLink}>Oops. There seems to be a problem with this link. Try generating a new one.</p>
					: <p className={classes.confirm}>Thank you ! Your Email is confirmed and from now on, you can log in !</p>
				}
			</div>
		</div>
	)
}

export default ConfirmEmailDummy;
