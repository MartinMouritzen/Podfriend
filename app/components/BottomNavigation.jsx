import React, { Component } from 'react';

import styles from '~/app/components/BottomNavigation.css';

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
				<div className={styles.menuItem}>
					Categories
				</div>
				<div className={styles.menuItem}>
					Podcasts
				</div>
				<div className={styles.menuItem}>
					Search
				</div>
			</div>
			);
	}
}
export default BottomNavigation;