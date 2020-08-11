import React from 'react';

import { ReviewStars } from 'podfriend-approot/components/Reviews/StarRating.jsx';

import styles from './ReviewPaneUI.css';

class RatingBreakDownLine  extends React.Component {
	render() {
		return (
			<div key={this.props.rating} className={styles.breakdownLine}>
				{this.props.ratings}
			</div>
		);
	}
}
class ReviewPaneUI extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={styles.reviewPane}>
				<div className={styles.reviewAggregatedInfo}>
					<div className={styles.totalScore}>4.44</div>
					<div className={styles.basedOn}>based on 43 reviews</div>
					<div className={styles.ratingBreakdownLines}>
						<div className={styles.ratingBreakdownLine}>
							<RatingBreakDownLine rating={5} ratings={60} totalRatings={100} />
							<RatingBreakDownLine rating={4} ratings={5} totalRatings={100} />
							<RatingBreakDownLine rating={3} ratings={10} totalRatings={100} />
							<RatingBreakDownLine rating={2} ratings={0} totalRatings={100} />
							<RatingBreakDownLine rating={1} ratings={25} totalRatings={100} />
						</div>
					</div>
				</div>
				<div className={styles.reviewList}>
					{ this.props.reviews && this.props.reviews.map((review,index) => {
						return (
							<div key={review.guid} className={styles.review}>
								<div className={styles.rating}>
									<ReviewStars rating={review.rating} />
								</div>
								<div className={styles.reviewerName}>
									{review.reviewerName}
								</div>
								<div className={styles.reviewDate}>
									{review.reviewDate}
								</div>
								<div className={styles.reviewContent}>
									{review.reviewContent}
								</div>
								
							</div>
						);
					}) }
				</div>
			</div>
		);
	}
}
export default ReviewPaneUI;