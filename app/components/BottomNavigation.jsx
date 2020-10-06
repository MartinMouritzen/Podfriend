import React, { Component } from 'react';

import styles from '~/app/components/BottomNavigation.css';

import { Link } from 'react-router-dom';

import {FaHome, FaPodcast } from "react-icons/fa";

/**
*
*/
class BottomNavigation extends Component {
	constructor(props) {
		super(props);

	}
	render() {
		return (
			<div className={styles.bottomNavigation}>
				<Link to='/' className={styles.menuItem}>
					<FaHome size="25" /><br />
					Home
				</Link>
				<Link to='/favorites/' className={styles.menuItem}>
					<FaPodcast size="25" /><br />
					Favorites
				</Link>
			</div>
			);
	}
}
export default BottomNavigation;