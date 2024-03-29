import React from 'react';

import { connect } from "react-redux";

import { loadReviews } from "podfriend-approot/redux/actions/podcastActions";

import ReviewPaneUI from 'podfriend-approot/components/Reviews/ReviewPaneUI.jsx';

class ReviewPane extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<ReviewPaneUI
				UI={ReviewPaneUI}
				onSubmitReview={this.props.onSubmitReview}
				podcastGuid={this.props.podcastGuid}
				podcastName={this.props.podcastName}
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
		if (this.props.podcastGuid) {
			this.props.loadReviews(this.props.podcastGuid);
		}
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.podcastGuid !== prevProps.podcastGuid) {
			this.props.loadReviews(this.props.podcastGuid);
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