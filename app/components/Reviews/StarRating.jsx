import React, { Component } from 'react';

import styles from 'podfriend-approot/components/Reviews/StarRating.css';

import FiveStar from 'podfriend-approot/images/review-5-star.png';
import BlankStar from 'podfriend-approot/images/review-0-star.png';

class ReviewStars extends Component {
	constructor(props) {
		super(props);
		this.renderStars = this.renderStars.bind(this);
	}
	/**
	*
	*/
	renderStars() {
		var stars = [];
		for(var i=1;i<=5;i++) {
			if (Math.round(this.props.rating) >= i) {
				stars.push(<div key={'StarRating' + i} className={styles.starFilled}>★</div>);
			}
			else {
				stars.push(<div key={'StarRating' + i} className={styles.starNormal}>★</div>);
			}
		}
		return stars;
	}
	render() {
		return (
			<div className={styles.stars}>
				{ this.renderStars() }
			</div>
		);
	}
}
/**
*
*/
class ReviewStarsWithText extends Component {
	render() {
		return (
			<div className={styles.starRating} style={this.props.style}>
				<ReviewStars rating={this.props.rating} />
				<div className={styles.reviewBasedOn}>
					{ this.props.reviews > 0 && 
						<>
						{this.props.reviews} reviews
						</>
					}
					{ !this.props.reviews &&
						<>
						No reviews yet
						</>
					}
				</div>
			</div>
		);
	}
}
export {
	ReviewStars,
	ReviewStarsWithText
}