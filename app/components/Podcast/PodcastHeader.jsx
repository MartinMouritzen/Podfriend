import React from 'react';

import styles from './PodcastHeader.css';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import { Link } from 'react-router-alias';

import { FaGlobeAmericas, FaMicrophoneAlt } from "react-icons/fa";

import { ReviewStarsWithText } from 'podfriend-approot/components/Reviews/StarRating.jsx';

import isElectron from 'is-electron';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';

const PodcastHeader = ({ coverImage, imageUrlHash = false, path, title, author, website, description, podcastLoading, podcastLoadingError, categories = false }) => {
	const goToWebsite = () => {
		if (isElectron()) {
			var shell = require('electron').shell;
			shell.openExternal(website);
		}
		else {
			window.open(website,"_blank");
		}
	}

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
							<div className={styles.podcastCover}><img class={styles.loadingIndicator} src={LoadingRings} /></div>
						}
						{ /*
						<div className={styles.starRating}>
							<ReviewStarsWithText rating={4} reviews={0} />
						</div>
						*/ }
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
			<div className={styles.categories}>
				{ categories && Object.keys(categories).map((categoryId) => {
					return (
						<div key={categoryId} className={styles.category}>{categories[categoryId]}</div>
					)

				} ) }
			</div>
		</>
	);
}
export default PodcastHeader;