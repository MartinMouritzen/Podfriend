import React, { useEffect, useState } from 'react';

import styles from './PodcastHeader.scss';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import { Link } from 'react-router-alias';

import { FaMapMarkerAlt, FaGlobeAmericas, FaMicrophoneAlt } from "react-icons/fa";

import { ReviewStars } from 'podfriend-approot/components/Reviews/StarRating.jsx';

import isElectron from 'is-electron';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';

import ReviewPane from 'podfriend-approot/components/Reviews/ReviewPane.jsx';

import PodcastMap from './PodcastMap.jsx';
import PodcastPersons from './PodcastPersons.jsx';

import Modal from 'podfriend-approot/components/Window/Modal';

const PodcastHeader = React.memo(({ coverImage, imageUrlHash = false, podcastGuid, path, title, author, website, description, reviewScore, reviewCount, podcastLoading, podcastLoadingError, categories = false, rssFeed = false }) => {
	const [location,setLocation] = useState(false);
	const [showLocation,setShowLocation] = useState(false);
	const [showReviews,setShowReviews] = useState(false);

	const [persons,setPersons] = useState(false);

	const goToWebsite = () => {
		if (isElectron()) {
			var shell = require('electron').shell;
			shell.openExternal(website);
		}
		else {
			window.open(website,"_blank");
		}
	}

	useEffect(() => {
		if (rssFeed.location) {
			console.log('Feed has location');
			console.log(rssFeed.location);
			setLocation(rssFeed.location);
		}
		else {
			setLocation(false);
		}
		if (rssFeed.persons) {
			setPersons(rssFeed.persons);
		}
		else {
			setPersons(false);
		}
	},[rssFeed]);

	const onDismissLocation = () => {
		setShowLocation(false);
	};
	const onDismissReviews = () => {
		setShowReviews(false);
	};
	const onSubmitReview = () => {
		setShowReviews(false);
	};

	return (
		<>
			<div className={styles.blueFiller} />
			<div className={styles.waveContainer}>
				<img src={Wave} className={styles.wave} />
			</div>
			<div className={styles.mainInfo}>
				<div className={styles.mainInfoInner}>
					<div>
						{ coverImage && 
							<PodcastImage
								alt={title + ' cover art'}
								imageErrorText={title}
								podcastPath={path}
								width={600}
								height={600}
								src={coverImage}
								className={styles.podcastCover}
								draggable="false"
								loadingComponent={() => { return ( <div className={styles.loadingCover}><img className={styles.loadingIndicator} src={LoadingRings} /></div> ) }}
							/>
						}
						{ !coverImage &&
							<div className={styles.podcastCover}><img className={styles.loadingIndicator} src={LoadingRings} /></div>
						}
					</div>
					<div className={styles.podcastInfo}>
					{ author &&
							<div className={styles.author}>
								<Link to={'/search/author/' + author + '/'} className={styles.authorLink}>
									<FaMicrophoneAlt /> {author}
								</Link>
								{ false && !this.props.selectedPodcast.parentguid &&
									<div className={styles.authorLink}>
										{this.props.selectedPodcast.author}
									</div>
								}
								{ website &&
									<span className={styles.website}>
										<span className={styles.middot}>&middot;</span>
										<span className={styles.podcastWebsiteLink} onClick={goToWebsite} title="Go to the show website">
											<FaGlobeAmericas /> <span className={styles.websiteLabel}>Website</span>
										</span>
									</span>
								}
							</div>
						}
						<h1 className={styles.podcastName} title={title}>
							{title}
						</h1>
						{ podcastLoading &&
							<div className="loading-line loading-line-short">&nbsp;</div>
						}
						{ !podcastLoading &&
							<div className={styles.starRating} onClick={() => { setShowReviews(true); } }>
								<ReviewStars rating={reviewScore} reviews={reviewCount} primaryColor={'#ffcc48'} secondaryColor={'#FFFFFF'} />
								<div className={styles.reviewCount}>
									{ reviewCount == 0 &&
										<>No ratings</>
									}
									{ reviewCount == 1 &&
										<>{reviewCount} rating</>
									}
									{ reviewCount > 1 &&
										<>{reviewCount} ratings</>
									}
								</div>
							</div>
						}
						
						{ !description && !podcastLoadingError && podcastLoading && 
							<div className={styles.description}>
								<div className="loading-line loading-line-long">&nbsp;</div>
								<div className="loading-line loading-line-short">&nbsp;</div>
								<div className="loading-line loading-line-mid">&nbsp;</div>
								<div className="loading-line loading-line-long">&nbsp;</div>
							</div>
						}
						{ (description || !podcastLoading) && 
							<div className={styles.description} dangerouslySetInnerHTML={{__html:description}} />
						}
					</div>
				</div>
			</div>

			{ !description && !podcastLoadingError && podcastLoading && 
				<div className={styles.descriptionBody}>
					<div className="loading-line loading-line-long">&nbsp;</div>
					<div className="loading-line loading-line-short">&nbsp;</div>
					<div className="loading-line loading-line-mid">&nbsp;</div>
					<div className="loading-line loading-line-long">&nbsp;</div>
				</div>
			}
			{ (description || !podcastLoading) && 
				<div className={styles.descriptionBody} dangerouslySetInnerHTML={{__html:description}} />
			}

			{ location !== false && location['#text'] &&
				<div className={styles.locationLine} onClick={() => { setShowLocation(!showLocation); }}>
					<FaMapMarkerAlt size="24" /> {location['#text']}
				</div>
			}
			{ showLocation !== false &&
				<Modal shown={showLocation} onClose={onDismissLocation}>
					<PodcastMap location={location} />
				</Modal>
			}
			{ showReviews !== false &&
				<Modal header={<h1>Reviews</h1>} shown={showReviews} onClose={onDismissReviews} snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight - 20]}>
					<ReviewPane podcastGuid={podcastGuid} podcastName={title} onSubmitReview={onSubmitReview} />
				</Modal>
			}
			{ persons !== false &&
				<div className={styles.personContainer}>
					<h2>Creators and guests behind the podcast</h2>
					<PodcastPersons persons={persons} />
				</div>
			}

			<div className={styles.categories}>
				{ categories && Object.keys(categories).map((categoryId) => {
					return (
						<div key={categoryId} className={styles.category}>{categories[categoryId]}</div>
					)

				} ) }
			</div>
		</>
	);
});
export default PodcastHeader;