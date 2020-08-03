import React, { Component } from 'react';

import { connect } from "react-redux";
import { viewPodcast, archivePodcast, unarchivePodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link, withRouter } from 'react-router-alias';

import sanitizeHtml from 'sanitize-html';

const md5 = require('md5');

const mapStateToProps = (state, ownProps) => {
	var useSelectedPodcast = state.podcast.selectedPodcast;
	
	var podcastPath = ownProps.location.pathname.substring(9);

	// If the current podcast does not match the path, it most likely means that the user clicked a link
	// instead of waiting for the podcast to load, we check if they sent a cache with the click, and use that
	if (state.podcast.selectedPodcast.path != podcastPath) {
		if (ownProps.location.state && ownProps.location.state.podcast) {
			if (ownProps.location.state.podcast.path == podcastPath) {
				useSelectedPodcast = ownProps.location.state.podcast;
			}
		}
	}
	
	if (!useSelectedPodcast) {
		console.log('This should not happen I think');
		console.log(state.podcast.selectedPodcast);
		console.log(state.podcast.podcastLoading);
		console.log(ownProps.location.state.podcast);
		console.log( ownProps.location.state.podcast.path);
	}
	
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode,
		selectedPodcast: useSelectedPodcast, // If podcast is loading, we'll see if the loading link passed along the podcast to display while waiting
		selectedPodcastEpisodes: state.podcast.selectedPodcastEpisodes,
		podcastLoading: state.podcast.podcastLoading,
		subscribedPodcasts: state.podcast.subscribedPodcasts,
		scrollToEpisode: (ownProps.location && ownProps.location.state && ownProps.location.state.fromPlayer) ? true : false
	};
}


const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		viewPodcast: (podcastPath) => { dispatch(viewPodcast(podcastPath)); },
		archivePodcast: (podcast) => { dispatch(archivePodcast(podcast)); },
		unarchivePodcast: (podcast) => { dispatch(unarchivePodcast(podcast)); }
	};
}

/**
*
*/
class PodCastPane extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		this.state = {
			podcastLoading: true,
			podcastFeed: {},
			scrolled: false,
			scrolledRequestTime: new Date()
		};

		this.adjustScrollOffsetOnLoad = this.adjustScrollOffsetOnLoad.bind(this);
	}
	/**
	*
	*/
	componentDidMount() {
		var podcastPath = this.props.location.pathname.substring(9);
		this.props.viewPodcast(podcastPath);
		
		this.adjustScrollOffsetOnLoad();
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.setState({
				podcastLoading: true
			},() => {
				var podcastPath = this.props.location.pathname.substring(9);
				this.props.viewPodcast(podcastPath);
			});
		}
		if (this.props.location.search != prevProps.location.search) {
			this.adjustScrollOffsetOnLoad();
		}
	}
	cumulativeOffset(element) {
	    var top = 0, left = 0;
	    do {
	        top += element.offsetTop  || 0;
	        left += element.offsetLeft || 0;
	        element = element.offsetParent;
	    } while(element);

	    return {
	        top: top,
	        left: left
	    };
	}
	/**
	*
	*/
	adjustScrollOffsetOnLoad(attempt = 0) {
		// We only want to do this on web. Need to find other method for doing it on mobile.
		if (typeof document == 'undefined') {
			return;
		}
		// console.log('hey we want to scroll!');
		if ((!this.props.selectedPodcastEpisodes || this.props.podcastLoading) || this.props.activePodcast.name != this.props.selectedPodcast.name) {
			// console.log('loading, let us try again');
			if (attempt > 50) {
				return;
			}
			setTimeout(() => {
				this.adjustScrollOffsetOnLoad(++attempt);
			},100);
		}
		else {
			if (this.props.scrollToEpisode) {
				for(var i=0;i<this.props.selectedPodcastEpisodes.length;i++) {
					if (this.props.selectedPodcastEpisodes[i].url == this.props.activeEpisode.url) {
						
						var episodeId = 'episode_' + md5(this.props.selectedPodcastEpisodes[i].url);
						var episodeElement = window.document.getElementById(episodeId);
						
						var clientRect = this.cumulativeOffset(episodeElement);
						
						// console.log('scrolling to : ' + this.props.selectedPodcastEpisodes[i].title + ', element position: ' + clientRect.top);
						this.props.scrollTo(clientRect.top - 200);
					}
				}
			}
		}
	}
	/**
	*
	*/
	render() {
		const PodcastPaneUI = this.props.UI;
		
		var description = '';
		
		// This should probably be done one single time, maybe on the server side and set as a property on the podcast instead?
		if (this.props.selectedPodcast && this.props.selectedPodcast.description) {
			description = sanitizeHtml(this.props.selectedPodcast.description,{
				allowedTags: ['i','em']
			});
		}
		
		let isArchived = false;
		if (this.props.subscribedPodcasts.length) {
			this.props.subscribedPodcasts.forEach((subscribedPodcast) => {
				if (subscribedPodcast.feedUrl === this.props.selectedPodcast.feedUrl) {
					if (subscribedPodcast.archived) {
						isArchived = true;
					}
				}
			});
		}
		
		return (
			<PodcastPaneUI
				description={description}
				isArchived={isArchived}

				activePodcast={this.props.activePodcast}
				activeEpisode={this.props.activeEpisode}
				selectedPodcast={this.props.selectedPodcast}
				selectedPodcastEpisodes={this.props.selectedPodcastEpisodes}
				podcastLoading={this.props.podcastLoading}
				subscribedPodcasts={this.props.subscribedPodcasts}
				scrollToEpisode={this.props.scrollToEpisode}
				
				archivePodcast={this.props.archivePodcast}
				unarchivePodcast={this.props.unarchivePodcast}
			/>
		);
	}
}


const ConnectedPodCastPane = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(PodCastPane));

export default ConnectedPodCastPane;

// export default PodCastPane;