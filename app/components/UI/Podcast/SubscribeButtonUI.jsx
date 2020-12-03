import React from 'react';

import { FaHeart, FaHeartBroken } from "react-icons/fa";

import styles from './SubscribeButtonUI.css';

/**
*
*/
class SubscribeButtonUI extends React.Component {
	render() {
		if (this.props.isSubscribed) {
			return (
				<div className={styles.subscribeButton} onClick={this.props.unsubscribeToPodcast}><FaHeartBroken /> Remove from Favorites</div>
			);
		}
		else {
			return (
				<div className={styles.subscribeButton} onClick={this.props.subscribeToPodcast}><FaHeart /> Add to Favorites</div>
			);
		}
	}
}

export default SubscribeButtonUI;