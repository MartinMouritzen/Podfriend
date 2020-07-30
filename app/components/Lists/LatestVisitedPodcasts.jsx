import React from 'react';

import { connect } from "react-redux";

import PodcastMatrix from './PodcastMatrix.jsx';

const mapStateToProps = (state) => ({
	lastVisitedPodcasts: state.podcast.lastVisitedPodcasts
})

class LatestVisitedPodcasts extends React.Component {
	render() {
		return (
			<PodcastMatrix type={'ScrollList'} podcasts={this.props.lastVisitedPodcasts} showLoadMore={true} />
		);
	}
}

const connectedLatestVisitedPodcasts = connect(
	mapStateToProps,
	null
)(LatestVisitedPodcasts);

export default connectedLatestVisitedPodcasts;