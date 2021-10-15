import React, { useState, useEffect, useRef } from 'react';

import EpisodeList from './EpisodeList.jsx';

import { useLocation } from 'react-router-dom';

import styles from './PodCastPane.css';

import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';
import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import PodcastHeader from './PodcastHeader.jsx';
import PodcastExtras from './PodcastExtras.jsx';

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

const PodCastPaneUI = ({ showEpisode = false, selectedPodcast, description, podcastLoading, podcastLoadingError, isSubscribed, subscribedPodcasts, subscribeToPodcast, unsubscribeToPodcast, isArchived, archivePodcast, unarchivePodcast, currentPodcastPlaying, onEpisodeSelect, rssFeed = false }) => {
	const location = useLocation();
	const podcastPane = useRef(null);

	useEffect(() => {
		podcastPane.current.scrollTop = 0;
	},[location]);

	const [tabIndex, setTabIndex] = useState('episodes');

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	return (
		<IonPage className='no-header-padding sectionPage'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref='/' />
					</IonButtons>
					<IonTitle>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<PodcastImage
								alt={selectedPodcast.name + ' cover art'}
								imageErrorText={selectedPodcast.name}
								podcastPath={selectedPodcast.path}
								width={120}
								height={120}
								src={selectedPodcast.artworkUrl600}
								className={styles.titlePodcastCover}
								draggable="false"
								loadingComponent={() => { return ( <div className={styles.loadingCover}><img className={styles.loadingIndicator} src={LoadingRings} /></div> ) }}
							/>
							<div className={styles.podcastTitle}>
								{selectedPodcast.name}
							</div>
						</div>
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonHeader collapse="condense">
					<IonToolbar>
						<PodcastHeader
						reviewCount={selectedPodcast.review_totalCount}
						reviewScore={selectedPodcast.review_totalScore}
						coverImage={selectedPodcast.artworkUrl600}
						imageUrlHash={selectedPodcast.imageUrlHash}
						categories={selectedPodcast.categories}
						podcastGuid={selectedPodcast.guid}
						path={selectedPodcast.path}
						title={selectedPodcast.name}
						author={selectedPodcast.author}
						website={selectedPodcast.link}
						description={description}
						podcastLoading={podcastLoading}
						podcastLoadingError={podcastLoadingError}

						rssFeed={rssFeed}
					/>
					<PodcastExtras
						isSubscribed={isSubscribed}
						selectedPodcast={selectedPodcast}
						subscribedPodcasts={subscribedPodcasts}
						subscribeToPodcast={subscribeToPodcast}
						unsubscribeToPodcast={unsubscribeToPodcast}
						isArchived={isArchived}
						podcastLoadingError={podcastLoading}
						archivePodcast={archivePodcast}
						unarchivePodcast={unarchivePodcast}

						rssFeed={rssFeed}
					/>
					</IonToolbar>
				</IonHeader>
			<div ref={podcastPane} className={styles.podcastPane}>
				<div className={styles.podcastContent}>
									
					<EpisodeList podcastPane={podcastPane} currentPodcastPlaying={currentPodcastPlaying} onEpisodeSelect={onEpisodeSelect} podcastInfo={selectedPodcast} episodes={selectedPodcast.episodes} rssFeed={rssFeed} />
									
	{/*
					<Tabs
						variant="fullWidth"
						value={tabIndex}
						onChange={handleTabChange}
						TabIndicatorProps={{
							style: {
								backgroundColor: '#0176e5'
							}
						}}
					>
						<Tab label={<StyledBadge badgeContent={4} max={999}>Episodes</StyledBadge>} value="episodes" />
						<Tab label={<StyledBadge badgeContent={3} max={999}>Reviews</StyledBadge>} value="reviews" />
					</Tabs>

					{ tabIndex === 'episodes' &&
						<div className={styles.episodeTab}>
							<div className={styles.episodeColumn}>
							<EpisodeList currentPodcastPlaying={currentPodcastPlaying} onEpisodeSelect={onEpisodeSelect} podcastInfo={selectedPodcast} episodes={selectedPodcast.episodes} />
							
								{ podcastLoadingError &&
									<div>
										Error reading Podcast File
									</div>
								}
								{ !podcastLoadingError && podcastLoading && 
									<div className={styles.episodeListLoading}>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
										<div className="loading-line loading-episode">&nbsp;</div>
									</div>
								}
							</div>
						</div>
					}
					{ tabIndex === 'reviews' &&
						<ReviewPane podcast={selectedPodcast} />
					}
	*/}
	{/*
					<Tab title="Community" link={'/podcast/' + selectedPodcast.path + '/community'}>
							community test content
						</Tab>

						<Tab title="Lists" link={'/podcast/' + selectedPodcast.path + '/lists'}>
							Lists that feature this podcast
						</Tab>
						
						<Tab title="Creators & Guests" link={'/podcast/' + selectedPodcast.path + '/creators-and-guests'}>
							creator test content
						</Tab>

						<Tab title="Podcast content" link={'/podcast/' + selectedPodcast.path + '/extraContent'}>
							podcast test content
						</Tab>
					*/}
				</div>
				{/*
					<div className={styles.headline}>Podcasts like this</div>
					<div style={{ paddingLeft: '30px', marginBottom: '30px' }}>... Coming soon!</div>
				*/}
			</div>
			</IonContent>
		</IonPage>
	);
}
export default PodCastPaneUI;