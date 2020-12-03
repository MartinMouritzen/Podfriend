import React from 'react';

import { format, distanceInWordsToNow } from 'date-fns';

import DOMPurify from 'dompurify';

import { ReviewStars } from 'podfriend-approot/components/Reviews/StarRating.jsx';

import Avatar from 'podfriend-approot/components/Avatar/Avatar.jsx';

import styles from './ReviewPaneUI.css';


function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

class ReviewAggregatedInfo extends React.PureComponent {
	render() {
		if (!this.props.totalCountReviews || !this.props.totalScore) {
			return (
				<div>No reviews yet!</div>
			);
		}
		
		return (
			<div className={styles.reviewAggregatedInfo}>
				<div style={{ display: 'flex'}}>
					<div className={styles.totalScore}>{parseFloat(this.props.totalScore).toFixed(1)}</div>
					<div>
						<ReviewStars rating={this.props.totalScore} size={30} />
						<div className={styles.basedOn}>based on {this.props.totalCountReviews} review{this.props.totalCountReviews != 1 ? 's' : ''}</div>
					</div>
				</div>
				<div className={styles.ratingBreakdownLines}>
					<RatingBreakDownLine rating={5} ratings={60} totalRatings={100} />
					<RatingBreakDownLine rating={4} ratings={5} totalRatings={100} />
					<RatingBreakDownLine rating={3} ratings={10} totalRatings={100} />
					<RatingBreakDownLine rating={2} ratings={0} totalRatings={100} />
					<RatingBreakDownLine rating={1} ratings={25} totalRatings={100} />
				</div>
			</div>
		);
	}
}
class RatingBreakDownLine extends React.PureComponent {
	render() {
		var percentage = this.props.ratings / this.props.totalRatings * 100;
		return (
			<div className={styles.ratingBreakdowLineContainer} key={this.props.rating}>
				<div className={styles.ratingBreakdowLineLabel}>
					{this.props.rating} stars
				</div>
				<div key={this.props.rating} className={styles.ratingBreakdownLine}>
					<div className={styles.ratingBreakdownLine} title={`${this.props.ratings} reviews. ${percentage}% of all reviews.`}>
						<div className={styles.ratingBreakdownLineInner} style={{ width: percentage + '%' }}>

						</div>
					</div>
				</div>
			</div>
		);
	}
}
class Review extends React.PureComponent {
	render() {
		var reviewContent = nl2br(DOMPurify.sanitize(this.props.reviewContent,{
			ALLOWED_TAGS: ['i','em','b','strong']
		}));
		
		return (
			<div key={this.props.guid} className={styles.review}>
				<div className={styles.avatarColumn}>
					<div className={styles.avatar}>
						<Avatar userGuid={this.props.userGuid} />
					</div>
				</div>
				<div className={styles.reviewColumn}>
					<div className={styles.rating}>
						<ReviewStars rating={this.props.rating} size={24} />
					</div>
					<div className={styles.reviewerName}>
						{this.props.reviewerName}
					</div>
					<div className={styles.reviewContent} dangerouslySetInnerHTML={{__html:reviewContent}} />
					<div className={styles.reviewDate}>
						<span className={styles.agoText}>{distanceInWordsToNow(this.props.reviewDate)} ago</span>
					</div>
				</div>
			</div>
		);
	}
}
class ReviewPaneUI extends React.PureComponent {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
	}
	render() {
		return (
			<div className={styles.reviewPane}>
				<h1>Feedback from other podfriends</h1>
				<div className={styles.reviewColumns}>
					<ReviewAggregatedInfo totalCountReviews={this.props.totalCountReviews} totalScore={this.props.totalScore} />
					<div className={styles.reviewList}>
						{ this.props.reviews && this.props.reviews.map((review,index) => {
							return (
								<Review
									guid={review.guid}
									userGuid={review.userGuid}
									rating={review.rating}
									reviewerName={review.reviewerName}
									reviewDate={review.reviewDate}
									reviewContent={review.reviewContent}
								
								/>
							);
						}) }
					</div>
				</div>
			</div>
		);
	}
}
export default ReviewPaneUI;