import React, { Component } from 'react';

import { connect } from "react-redux";
import { subscribeToPodcast, unsubscribeToPodcast } from "podfriend-approot/redux/actions/index";

import { Link } from 'react-router-dom';

import { FaHeart, FaHeartBroken } from "react-icons/fa";

import styles from './SearchResult.css';

function mapStateToProps(state) {
	return {
		subscribedPodcasts: state.podcast.subscribedPodcasts
	};
}

function mapDispatchToProps(dispatch) {
	return {
		subscribeToPodcast: (podcast) => { dispatch(subscribeToPodcast(podcast)); },
		unsubscribeToPodcast: (podcast) => { dispatch(unsubscribeToPodcast(podcast)); }
	};
}

/**
*
*/
class SearchResult extends Component {
	/**
	*
	*/
	render() {
		let isSubscribed = false;

		this.props.subscribedPodcasts.forEach((podcast) => {
			if (podcast.feedUrl === this.props.result.feedUrl) {
				isSubscribed = true;
			}
		});
		
		return (
			<Link to={{
					pathname: '/podcast/' + this.props.result.path,
					state: {
						podcast: this.props.result
					}
				}} className={styles.searchResult}>
				<div style={{ backgroundImage: 'url(' + this.props.result.artworkUrl600 + ')' }} className={styles.thumbNail}>
					{ !isSubscribed &&
						<div className={styles.subscribe} onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.props.subscribeToPodcast(this.props.result);  }}>
							<FaHeart />
						</div>
					}
					{ isSubscribed &&
						<div className={styles.unSubscribe} onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.props.unsubscribeToPodcast(this.props.result); /* this.props.onUnsubscribe(this.props.result); */ }}>
							<FaHeartBroken />
						</div>
					}					
				</div>
				<div className={styles.content}>
					<div className={styles.author}>
						{this.props.result.author}
					</div>
					<div className={styles.title}>
						{this.props.result.name}
					</div>
					<div className={styles.tags}>
					
					</div>
				</div>
			</Link>
		);
	}
}

const ConnectedSearchResult = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResult);

export default ConnectedSearchResult;