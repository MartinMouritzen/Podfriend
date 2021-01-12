import React from 'react';

import { Link, useLocation } from 'react-router-alias';

// import PodcastUtil from '~/app/library/PodcastUtil.js';

import styles from './FavoriteListUI.scss';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';

const FavoriteListUI = ({ showResponsiveList, subscribedPodcasts, showArchived, activePodcast }) => {
	var location = useLocation();

	var isCheckingPodcasts = false;

	return (
		<div className={showResponsiveList ? styles.showResponsive + ' ' + styles.favoriteList : styles.favoriteList}>
			{ isCheckingPodcasts &&
				<div className={styles.checkingChanges}>
					<img className={styles.loadingIndicator} src={LoadingRings} /> Refreshing your podcasts
				</div>
			}
			{ subscribedPodcasts && subscribedPodcasts.length === 0 &&
				<div className={styles.noPodcastsMessage}>
					This is where your favorite podcasts will appear.<br /><br />
					Favorite a podcast, to put it in here!
				</div>
			}
			{ subscribedPodcasts && subscribedPodcasts.map((podcast,index) => {
					var isArchived = !showArchived && podcast.archived;

					var isPlaying = activePodcast && activePodcast.feedUrl == podcast.feedUrl;
					
					var podcastPath = location.pathname.substring(9);
					var subPathIndex = podcastPath.indexOf('/');
					
					if (subPathIndex !== -1) {
						podcastPath = podcastPath.substring(0,subPathIndex);
					}
					
					var isSelected = podcast.path == podcastPath;

					// var podcastInternalUrl = '/podcast/' + PodcastUtil.generatePodcastUrl(podcast.name) + '/';

					return (
						<Link to={{
								pathname: '/podcast/' + podcast.path,
								state: {
									podcast: podcast
								}
							}} className={isArchived ? styles.podcastArchived : isSelected ? styles.podcastSelected : isPlaying ? styles.podcastPlaying : styles.podcast} key={podcast.name} >
							<PodcastImage
								podcastPath={podcast.path}
								imageErrorText={podcast.name}
								src={podcast.artworkUrl100}
								className={styles.cover}
								width={120}
								height={120}
							/>
							<div className={styles.podcastDetails}>
								<span className={styles.podcastName}>{podcast.name}</span>
								{ /* <span className={styles.episodesInfo}>12 episodes, 2 new</span> */ }
							</div>
						</Link>
						
					)
				})
			}
		</div>
	);
}

export default FavoriteListUI;