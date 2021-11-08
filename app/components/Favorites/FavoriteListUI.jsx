import React, { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router-alias';

// import PodcastUtil from '~/app/library/PodcastUtil.js';

import { useSelector } from 'react-redux';

import styles from './FavoriteListUI.scss';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import LoadingRings from 'podfriend-approot/images/design/loading/loading1.svg';

import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonButton,
	IonIcon,
	IonContent,
	IonBackButton,
	IonMenuButton,
	IonSearchbar,
	IonSegment,
	IonSegmentButton,
	IonLabel,
	IonReactRouter,
	IonRouterOutlet
} from '@ionic/react';

const FavoriteListUI = React.memo(({ showResponsiveList, subscribedPodcasts, showArchived, activePodcast }) => {
	var location = useLocation();

	const [showPodcastCheckIndicator,setShowPodcastCheckIndicator] = useState(false);

	var isCheckingPodcasts = useSelector((state) => state.ui.syncHappening);

	useEffect(() => {
		setShowPodcastCheckIndicator(isCheckingPodcasts);
	},[isCheckingPodcasts]);

	const renderInnerList = () => {
		return (
			<div className={showResponsiveList ? styles.showResponsive + ' ' + styles.favoriteList : styles.favoriteList}>
				{ showPodcastCheckIndicator &&
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

						const podcastCover = (podcast.artworkUrl100 ? podcast.artworkUrl100 : podcast.image);

						// var podcastInternalUrl = '/podcast/' + PodcastUtil.generatePodcastUrl(podcast.name) + '/';

						// console.log(podcast);

						return (
							<Link
								to={{
									pathname: '/podcast/' + podcast.path,
									state: {
										podcast: podcast
									}
								}}
								className={(podcast.archived ? styles.podcastArchived + ' ' : '') + (isArchived ? styles.podcastHidden : isSelected ? styles.podcastSelected : isPlaying ? styles.podcastPlaying : styles.podcast)}
								key={podcast.name}
							>
									<PodcastImage
										podcastPath={podcast.path}
										imageErrorText={podcast.name}
										src={podcastCover}
										className={styles.cover}
										width={400}
										height={400}
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
	};

	if (showResponsiveList !== true) {
		return renderInnerList();
	}
	else {
		return (
			<IonPage className='sectionPage'>
				{ showResponsiveList &&
					<IonHeader>
						<IonToolbar>
							<IonButtons slot="start">
								<IonBackButton defaultHref='/' />
							</IonButtons>
							<IonTitle>
								Followed podcasts
							</IonTitle>
						</IonToolbar>
					</IonHeader>
				}
				<IonContent>
					{ showResponsiveList &&
						<IonHeader collapse="condense">
							<IonToolbar>
								<IonTitle size="large">
									Followed podcasts
								</IonTitle>
							</IonToolbar>
						</IonHeader>
					}
					{ renderInnerList() }
				</IonContent>
			</IonPage>
		);
	}
});

export default FavoriteListUI;