import React, { useState, useEffect } from 'react';

import { ReviewStars } from 'podfriend-approot/components/Reviews/StarRating.jsx';
import TextField from '@material-ui/core/TextField';

import { useSelector } from 'react-redux';

import HappyPodfriend from 'podfriend-approot/images/design/flow-illustrations/podfriend-happy.png';

import { FaCheckCircle } from 'react-icons/fa';

import styles from './WriteReviewForm.scss';

const STATUS_RATE = 1;
const STATUS_RATE_PUBLISHING = 2;
const STATUS_REVIEW = 3;
const STATUS_REVIEW_PUBLISHING = 4;

const WriteReviewForm = ({ podcastName, podcastGuid, onSubmitReview }) => {
	const [status,setStatus] = useState(STATUS_RATE);	
	const [starValue,setStarValue] = useState(0);
	const [reviewText,setReviewText] = useState('');
	const [errorMessage,setErrorMessage] = useState(false);

	const [checkingForReview,setCheckingForReview] = useState(false);
	const [existingReview,setExistingReview] = useState(false);

	const [hasSavedRating,setHasSavedRating] = useState(false);
	const [savingReview,setSavingReview] = useState(false);
	const [hasSavedReview,setHasSavedReview] = useState(false);

	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const profileData = useSelector((state) => state.user.profileData);
	const authToken = useSelector((state) => state.user.authToken);

	useEffect(() => {
		setStarValue(0);
		setReviewText('');
		setExistingReview(false);
		setHasSavedRating(false);

		setCheckingForReview(true);

		const checkIfUserHasReview = () => {
			const reviewUrl = 'https://api.podfriend.com/podcast/reviews/?onlyUser=true&podcastGuid=' + podcastGuid;
			fetch(reviewUrl, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${authToken}`
				}
			})
			.then((resp) => {
				return resp.json()
			})
			.then((response) => {
				if (response.hasReview) {
					setStarValue(response.rating);
					setReviewText(response.reviewContent);
					setExistingReview(true);
				}
			})
			.catch((error) => {
				console.log(error);
			});
		};
		checkIfUserHasReview();
	},[podcastGuid]);

	const saveRating = (rating,reviewContent = '') => {
		return new Promise((resolve,reject) => {
			const ratingURL = 'https://api.podfriend.com/podcast/reviews/';

			const postData = {
				podcastGuid: podcastGuid,
				rating: rating,
				reviewContent: reviewContent
			};

			return fetch(ratingURL, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${authToken}`
				},
				body: JSON.stringify(postData)
			})
			.then((resp) => {
				return resp.json()
			})
			.then((response) => {
				return resolve();
			})
			.catch((error) => {
				return reject(error);
			});
		});
	};

	const onStarClick = (newRating) => {
		console.log('setHasSavedRating false');
		setHasSavedRating(false);
		saveRating(newRating)
		.then(() => {
			console.log('setHasSavedRating true');
			setStarValue(newRating);
			setHasSavedRating(true);
		})
		.catch((error) => {
			console.log('error rating podcast');
			console.log(error);
		});
	};

	const onReviewTextChange = (event) => {
		setReviewText(event.target.value);
	};

	const onSubmit = () => {
		setSavingReview(true);
		setHasSavedReview(false);
		if (!reviewText) {
			setErrorMessage('You did not write any review text, please add at least 10 characters. It really helps other Podcasters with a bit of information about what you liked or disliked about the show.');
		}
		else {
			saveRating(starValue,reviewText)
			.then(() => {
				if (onSubmitReview) {
					setHasSavedReview(true);
					// onSubmitReview();
				}
			})
			.catch((error) => {
				setErrorMessage('An error happened while reviewing the podcast. This is probably not your fault. Please contact info@podfriend.com if you think this is a mistake.');
				console.log('error reviewing podcast');
				console.log(error);
			});
		}
	};

	return (
		<div className={styles.writeReviewForm}>
			{ hasSavedReview === true &&
				<div className={styles.reviewWritten}>
					<div className={styles.reviewWrittenIllustration}>
						<img src={HappyPodfriend} />
					</div>
					<div className={styles.reviewWrittenHeadline}>
						<h2>Your review has been saved!</h2>
					</div>
					<p>Feels good doesn't it?</p>

					<div style={{ width: '200px'}} onClick={onSubmitReview}>
						<button>Back to podcast</button>
					</div>
				</div>
			}
			{ hasSavedReview === false && starValue === 0 &&
				<>
					<p>
						Rating a podcast really helps other podcast listeners
					</p>
					<h2>How would you rate &quot;{podcastName}&quot;?</h2>

					<ReviewStars size={46} rating={starValue} onClick={onStarClick} />
					<div className={styles.starExplanation}>Click to rate the podcast</div>
				</>
			}

			{ hasSavedReview === false && starValue !== 0 && 
				<div className={styles.writeReviewFormFields}>
					<div style={{ marginBottom: '5px' }}>
						You rated the podcast
					</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<ReviewStars size={36} rating={starValue} onClick={onStarClick} />
						<div style={{ marginLeft: 10 }}>
							{ hasSavedRating === true && 
								<span><FaCheckCircle fill="#27bd72" style={{ position: 'relative', top: '2px' }} /> Rating saved</span>
							}
						</div>
					</div>
					<p>
						{ existingReview === true &&
							<>You already rated this podcast, but you can modify the rating above if you want!</>
						}
						{ existingReview === false &&
							<>Thanks for the rating! Would you consider adding a review? It really helps others in deciding to listen to the podcast!</>
						}
					</p>
					<h2>
						{ existingReview === true &&
							<>Do you want to edit your review?</>
						}
						{ existingReview === false &&
							<>Add a review for &quot;{podcastName}&quot;?</>
						}
					</h2>
					<TextField
						style={{backgroundColor: '#F9F9F9' }}
						onChange={onReviewTextChange}
						value={reviewText}
						label={'How do you feel about the podcast?'}
						variant={'outlined'}
						multiline
						rows={8}
						fullWidth
					/>

					{ errorMessage !== false &&
						<div className="errorMessage">
							{errorMessage}
						</div>
					}

					<button onClick={onSubmit}>
						{ existingReview === true &&
							<>Modify Review</>
						}
						{ existingReview === false &&
							<>Post Review</>
						}
					</button>
				</div>
			}
		</div>
	);
};
export default WriteReviewForm;