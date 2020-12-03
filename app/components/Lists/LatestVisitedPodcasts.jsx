import React from 'react';

import { connect } from "react-redux";

import PodcastMatrix from './PodcastMatrix.jsx';

const mapStateToProps = (state) => ({
	lastVisitedPodcasts: state.podcast.lastVisitedPodcasts
})

class LatestVisitedPodcasts extends React.Component {
	render() {
		if (this.props.lastVisitedPodcasts.length > 0) {
			return (
				<div className='section'>
					<div className='sectionInner'>
						<div className='sectionSubTitle'>Your</div>
						<div className='sectionTitle'>latest podcasts</div>
					</div>
					<PodcastMatrix type='scrollList' podcasts={this.props.lastVisitedPodcasts} showLoadMore={true} />
				</div>
			);
		}
		else {
			return null;
		}
	}
}

const connectedLatestVisitedPodcasts = connect(
	mapStateToProps,
	null
)(LatestVisitedPodcasts);

export default connectedLatestVisitedPodcasts;