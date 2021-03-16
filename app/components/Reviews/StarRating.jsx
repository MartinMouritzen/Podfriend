import React from 'react';

import styles from 'podfriend-approot/components/Reviews/StarRating.css';

import { FaStar } from "react-icons/fa";

/*
import FiveStar from 'podfriend-approot/images/review-5-star.png';
import BlankStar from 'podfriend-approot/images/review-0-star.png';
*/

const ReviewStar = ({ full, size, rating, primaryColor, secondaryColor, onClick = false }) => {
	return (
		<div
			key={'StarRating' + rating}
			className={(full ? styles.starFilled : styles.starNormal)}
			style={{ fontSize: size ? size : false }}
			onClick={() => { if (onClick) { onClick(rating); } }}
		>
				<FaStar fill={(full ? primaryColor : secondaryColor)} />
		</div>
	);
};

const ReviewStars = ({ rating, size, primaryColor = '#ffcc48', secondaryColor = '#75757e', onClick = false }) => {
	const renderStars = () => {
		var stars = [];
		for(var i=1;i<=5;i++) {
			stars.push(<ReviewStar full={(Math.round(rating) >= i)} rating={i} size={size} onClick={onClick} primaryColor={primaryColor} secondaryColor={secondaryColor} />);
		}
		return stars;
	}
	return (
		<div className={styles.stars}>
			{ renderStars() }
		</div>
	);
}
/**
*
*/
const ReviewStarsWithText = ({ rating, reviews, primaryColor, secondaryColor, style, onClick, size}) => {
	return (
		<div className={styles.starRating} style={style} onClick={onClick}>
			<ReviewStars
				primaryColor={primaryColor}
				secondaryColor={secondaryColor}
				rating={rating}
				size={size}
			/>
			<div className={styles.reviewBasedOn}>
				{ reviews > 0 && 
					<>
					{reviews} reviews
					</>
				}
				{ !reviews &&
					<>
					No reviews yet
					</>
				}
			</div>
		</div>
	);
}
export {
	ReviewStars,
	ReviewStarsWithText
}