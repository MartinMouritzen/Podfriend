import React, { Component } from 'react';

import SubscribeButtonUI from './SubscribeButtonUI.jsx';

/*
const mapStateToProps = (state) => ({
	selectedPodcast: state.podcast.selectedPodcast,
	subscribedPodcasts: state.podcast.subscribedPodcasts
})


const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		subscribeToPodcast: (podcast) => { dispatch(subscribeToPodcast(podcast)); },
		unsubscribeToPodcast: (podcast) => { dispatch(unsubscribeToPodcast(podcast)); }
	};
}
*/

/**
*
*/
class SubscribeButton extends Component {
	constructor(props) {
		super(props);
		
		this.__subscribeToPodcast = this.__subscribeToPodcast.bind(this);
		this.__unsubscribeToPodcast = this.__unsubscribeToPodcast.bind(this);
	}
	__subscribeToPodcast() {
		this.props.subscribeToPodcast(this.props.selectedPodcast);
	}
	__unsubscribeToPodcast() {
		this.props.unsubscribeToPodcast(this.props.selectedPodcast);
	}
	render() {
		let isSubscribed = false;
		this.props.subscribedPodcasts.forEach((podcast) => {
			if (podcast.path === this.props.selectedPodcast.path) {
				isSubscribed = true;
			}
		});

		if (this.props.selectedPodcast && this.props.selectedPodcast.path) {
			return (
				<SubscribeButtonUI
					isSubscribed={isSubscribed}
					subscribeToPodcast={this.__subscribeToPodcast}
					unsubscribeToPodcast={this.__unsubscribeToPodcast}
				/>
			);
		}
		else {
			return null;
		}
	}
}

export default SubscribeButton;