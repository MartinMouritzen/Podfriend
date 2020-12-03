import React, { Component } from 'react';

import { connect } from "react-redux";
import { subscribeToPodcast, unsubscribeToPodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link } from 'react-router-dom';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

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
			// if (podcast.feedUrl === this.props.result.feedUrl) {
			if (podcast.path === this.props.result.path) {
				isSubscribed = true;
			}
		});
		
		return (
			<Link to={{
					pathname: '/podcast/' + this.props.result.path,
					state: {
						podcast: this.props.result
					}
				}} className='podcastItem'>
				<PodcastImage
					podcastPath={this.props.result.path}
					imageErrorText={this.props.result.name}
					width={600}
					height={600}
					src={this.props.result.artworkUrl600}
					className='cover'
					draggable="false"
				/>
				<div className='subscribeContainer'>
					{ !isSubscribed &&
						<div className='subscribe' onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.props.subscribeToPodcast(this.props.result);  }}>
							<FaHeart />
						</div>
					}
					{ isSubscribed &&
						<div className='unsubscribe' onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.props.unsubscribeToPodcast(this.props.result); }}>
							<FaHeartBroken />
						</div>
					}					
				</div>
				<div className='content'>
					<div className='author'>
						{this.props.result.author}
					</div>
					<div className='title'>
						{this.props.result.name}
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