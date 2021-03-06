import React, { Component } from 'react';

import { connect } from "react-redux";
import { viewPodcast, archivePodcast, unarchivePodcast, subscribeToPodcast, unsubscribeToPodcast } from "podfriend-approot/redux/actions/podcastActions";

import PodcastFeed from 'podfriend-approot/library/PodcastFeed.js';

import { Link, withRouter } from 'react-router-alias';

import DOMPurify from 'dompurify';

const mapStateToProps = (state, ownProps) => {
	var useSelectedPodcast = state.podcast.selectedPodcast;
	
	// var podcastPath = ownProps.location.pathname.substring(9);
	var podcastPath = ownProps.match.params.podcastName;

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
		if (ownProps.location && ownProps.location.state && ownProps.location.state.podcast) {
			console.log(ownProps.location.state.podcast);
			console.log( ownProps.location.state.podcast.path);
		}
	}
	
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode,
		selectedPodcast: useSelectedPodcast, // If podcast is loading, we'll see if the loading link passed along the podcast to display while waiting
		selectedPodcastEpisodes: state.podcast.selectedPodcastEpisodes,
		podcastLoading: state.podcast.podcastLoading,
		subscribedPodcasts: state.podcast.subscribedPodcasts,
		podcastLoadingError: state.podcast.podcastLoadingError,
		scrollToEpisode: (ownProps.location && ownProps.location.state && ownProps.location.state.fromPlayer) ? true : false
	};
}


const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		viewPodcast: (podcastPath) => { dispatch(viewPodcast(podcastPath)); },
		subscribeToPodcast: (podcast) => { dispatch(subscribeToPodcast(podcast)); },
		unsubscribeToPodcast: (podcast) => { dispatch(unsubscribeToPodcast(podcast)); },
		archivePodcast: (podcast) => { console.log('archiving'); dispatch(archivePodcast(podcast)); },
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
			scrolledRequestTime: new Date(),
			fetchingRSSFeed: false,
			fetchedRSSFeed: false,
			rssFeed: false
		};

		this.adjustScrollOffsetOnLoad = this.adjustScrollOffsetOnLoad.bind(this);
	}

	retrieveOriginalPodcastFeed() {
		// console.error('wa1');
		if (!this.state.fetchedRSSFeed && !this.state.fetchingRSSFeed) {
			// console.error('wa2');
			this.setState({
				fetchingRSSFeed: true,
				rssFeed: false
			},async () => {
				// console.error('wa3');
				var podcastFeed = new PodcastFeed(this.props.selectedPodcast.feedUrl);
				podcastFeed.parse()
				.then((feed) => {
					// console.error('wa4');
					// console.error(feed);
					this.setState({
						fetchingRSSFeed: false,
						fetchedRSSFeed: true,
						rssFeed: feed
					});	
				})
				.catch((error) => {
					console.error('Error parsing RSS feed: ');
					console.error(error);
				});
			});
		}
	}
	/**
	*
	*/
	componentDidMount() {
		// var podcastPath = this.props.location.pathname.substring(9);
		var podcastPath = this.props.match.params.podcastName;
		this.props.viewPodcast(podcastPath);
		
		this.adjustScrollOffsetOnLoad();
		this.retrieveOriginalPodcastFeed();
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		var podcastPath = this.props.match.params.podcastName;
		var prevPodcastPath = prevProps.match.params.podcastName

		// console.error('cdu: ' + this.props.selectedPodcast.feedUrl);
		// console.error('dcu: ' + prevProps.selectedPodcast.feedUrl);
				
		if (this.props.selectedPodcast.feedUrl !== prevProps.selectedPodcast.feedUrl) {
			console.log('cdu2: ' + this.props.selectedPodcast.feedUrl);
			this.setState({
				fetchingRSSFeed: false,
				fetchedRSSFeed: false,
				rssFeed: false
			},() => {
				this.retrieveOriginalPodcastFeed();
			});
		}
		console.log('this.props.location.pathname: ' + this.props.location.pathname);
		if (podcastPath != prevPodcastPath) {
			this.setState({
				podcastLoading: true
			},() => {
				this.props.viewPodcast(podcastPath);
			});

			this.adjustScrollOffsetOnLoad();
		}
	}
	cumulativeOffset(element) {
		if (!element) {
			return { top: 0, left: 0 }
		}
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
						
						var episodeId = 'episode-' + this.props.selectedPodcastEpisodes[i].id;
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
			description = DOMPurify.sanitize(this.props.selectedPodcast.description,{
				ALLOWED_TAGS: [] // we used to allow 'i','em', but it doesn't work on mobile. I'm not sure I can see a good reason to have them.
			})
			.trim();
		}
		
		let isSubscribed = false;
		let isArchived = false;
		if (this.props.subscribedPodcasts.length) {
			this.props.subscribedPodcasts.forEach((subscribedPodcast) => {
				if (subscribedPodcast.feedUrl === this.props.selectedPodcast.feedUrl) {
					isSubscribed = true;
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
				isSubscribed={isSubscribed}

				rssFeed={this.state.rssFeed}

				showEpisode={this.props.showEpisode}
				
				podcastLoadingError={this.props.podcastLoadingError}

				activePodcast={this.props.activePodcast}
				activeEpisode={this.props.activeEpisode}
				selectedPodcast={this.props.selectedPodcast}
				selectedPodcastEpisodes={this.props.selectedPodcastEpisodes}
				podcastLoading={this.props.podcastLoading}
				subscribedPodcasts={this.props.subscribedPodcasts}
				scrollToEpisode={this.props.scrollToEpisode}
				
				subscribeToPodcast={this.props.subscribeToPodcast}
				unsubscribeToPodcast={this.props.unsubscribeToPodcast}
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