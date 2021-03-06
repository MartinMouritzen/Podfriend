import React, { Component } from 'react';

import styles from 'podfriend-approot/components/Reviews/StarRating.css';

import { FaStar } from "react-icons/fa";

/*
import FiveStar from 'podfriend-approot/images/review-5-star.png';
import BlankStar from 'podfriend-approot/images/review-0-star.png';
*/

const ReviewStars = ({ rating, size, primaryColor = '#ffcc48', secondaryColor = '#ff23aa'} ) => {
	const renderStars = () => {
		var stars = [];
		for(var i=1;i<=5;i++) {
			if (Math.round(rating) >= i) {
				stars.push(<div key={'StarRating' + i} className={styles.starFilled} style={{ fontSize: size ? size : false }}><FaStar fill={primaryColor} /></div>);
			}
			else {
				stars.push(<div key={'StarRating' + i} className={styles.starNormal} style={{ fontSize: size ? size : false }}><FaStar fill={secondaryColor} /></div>);
			}
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
	console.log('secondaryColor: ' + secondaryColor);
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