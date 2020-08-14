import React from 'react';

import { connect } from "react-redux";

import { loadReviews } from "podfriend-approot/redux/actions/podcastActions";

import ReviewPaneUI from 'podfriend-ui/Reviews/ReviewPaneUI.jsx';

class ReviewPane extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		console.log('ReviewPane constructor');
	}
	render() {
		return (
			<ReviewPaneUI
				UI={ReviewPaneUI}
				reviews={this.props.reviews}
				totalCountReviews={this.props.totalCountReviews}
				totalScore={this.props.totalScore}
			/>
		);
	}
	/**
	*
	*/
	componentDidMount() {
		if (this.props.podcast.guid) {
			this.props.loadReviews(this.props.podcast.guid);
		}
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.podcast.guid !== prevProps.podcast.guid) {
			this.props.loadReviews(this.props.podcast.guid);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		reviews: state.podcast.reviews,
		reviewsLoading: state.podcast.reviewsLoading,
		totalCountReviews: state.podcast.totalCountReviews,
		totalScore: state.podcast.totalScore
	};
}


const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		loadReviews: (podcastGuid) => { dispatch(loadReviews(podcastGuid)); }
	};
}


const ConnectedReviewPane = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReviewPane);

export default ConnectedReviewPane;