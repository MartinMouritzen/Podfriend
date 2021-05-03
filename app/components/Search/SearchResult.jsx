import React, { Component } from 'react';

import { connect } from "react-redux";
import { subscribeToPodcast, unsubscribeToPodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link } from 'react-router-dom';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import { FaHeart, FaHeartBroken } from "react-icons/fa";

import { format } from 'date-fns';

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

		// console.log(this.props.result);

		if (this.props.searchType == 'podcast') {
			const resultUrl = '/podcast/' + this.props.result.path;
			
			return (
				<Link to={{
						pathname: resultUrl,
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
		else {
			const resultUrl = '/podcast/' + this.props.result.path + '/' + this.props.result.id;
			var datePublished = format(new Date(this.props.result.datePublished * 1000),'MMM D, YYYY');
			
			return (
				<Link to={{
						pathname: resultUrl,
						state: {
							podcast: this.props.result
						}
					}} className='podcastItem'>
					<PodcastImage
						podcastPath={this.props.result.path}
						imageErrorText={this.props.result.title}
						width={600}
						height={600}
						src={this.props.result.image ? this.props.result.image : this.props.result.feedImage}
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
							{this.props.result.name}
						</div>
						<div className='title'>
							{this.props.result.title}
						</div>
						<div className='date'>
							{datePublished}
						</div>
					</div>
				</Link>
			);
		}
	}
}

const ConnectedSearchResult = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResult);

export default ConnectedSearchResult;