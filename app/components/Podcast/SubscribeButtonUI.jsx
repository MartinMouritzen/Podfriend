import React from 'react';

import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

import styles from './SubscribeButtonUI.css';

/**
*
*/
class SubscribeButtonUI extends React.Component {
	render() {
		if (this.props.isSubscribed) {
			return (
				<div className={styles.subscribeButton} onClick={this.props.unsubscribeToPodcast}><FaMinusCircle /> Unfollow</div>
			);
		}
		else {
			return (
				<div className={styles.subscribeButton} onClick={this.props.subscribeToPodcast}><FaPlusCircle /> Follow</div>
			);
		}
	}
}

export default SubscribeButtonUI;