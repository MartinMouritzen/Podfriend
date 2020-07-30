import React, { Component } from 'react';

import { connect } from "react-redux";
import { subscribeToPodcast, unsubscribeToPodcast } from "podfriend-approot/redux/actions/index";

import SubscribeButtonUI from 'podfriend-ui/Podcast/SubscribeButtonUI.jsx';


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
			if (podcast.feedUrl === this.props.selectedPodcast.feedUrl) {
				isSubscribed = true;
			}
		});
		
		return (
			<SubscribeButtonUI
				isSubscribed={isSubscribed}
				subscribeToPodcast={this.__subscribeToPodcast}
				unsubscribeToPodcast={this.__unsubscribeToPodcast}
			/>
		);
	}
}

const ConnectedSubscribeButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(SubscribeButton);

export default ConnectedSubscribeButton;