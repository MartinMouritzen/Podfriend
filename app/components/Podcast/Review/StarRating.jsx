import React, { Component } from 'react';

import styles from './StarRating.css';

import FiveStar from 'podfriend-approot/images/review-5-star.png';
import BlankStar from 'podfriend-approot/images/review-0-star.png';

/**
*
*/
class StarRating extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.state = {
			rating: false
		};
	}
	/**
	*
	*/
	renderStars() {
		var stars = [];
		for(var i=1;i<=5;i++) {
			stars.push(<img key={'star' + i} src={BlankStar} />);
		}
		return stars;
	}
	render() {
		return (
			<div className={styles.starRating} style={this.props.style}>
				<div>
					{ this.renderStars() }
				</div>
				<div className={styles.reviewBasedOn}>
					{ !this.state.rating &&
						<React.Fragment>
							You haven't rated this podcast yet.
						</React.Fragment>
					}
					{ this.state.rating && this.state.rating > 0 &&
						<React.Fragment>
							You gave this podcast {this.state.rating} stars.
						</React.Fragment>
					}
				</div>
			</div>
		);
	}
}
export default StarRating;