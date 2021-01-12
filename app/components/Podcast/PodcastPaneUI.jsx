import React, { useState, useEffect, useRef } from 'react';

import EpisodeList from './EpisodeList.jsx';

import { useLocation } from 'react-router-dom';

import Header from 'podfriend-approot/components/Header/Header.jsx';

import ReviewPane from 'podfriend-approot/components/Reviews/ReviewPane.jsx';

import { Tabs, Tab } from 'podfriend-approot/components/wwt/Tabs/Tabs.jsx';

import styles from './PodCastPane.css';

import PodcastHeader from './PodcastHeader.jsx';
import PodcastExtras from './PodcastExtras.jsx';

const PodCastPaneUI = ({ showEpisode = false, selectedPodcast, description, podcastLoading, podcastLoadingError, isSubscribed, subscribedPodcasts, subscribeToPodcast, unsubscribeToPodcast, isArchived, archivePodcast, unarchivePodcast, currentPodcastPlaying, onEpisodeSelect, rssFeed = false }) => {
	const location = useLocation();
	const podcastPane = useRef(null);

	useEffect(() => {
		podcastPane.current.scrollTop = 0;
	},[location]);

	return (
		<div ref={podcastPane} className={styles.podcastPane}>
			{/*
			<Header>
				<div>
					Test of the awesome header
				</div>
			</Header>
			*/}
			<PodcastHeader
				coverImage={selectedPodcast.artworkUrl600}
				imageUrlHash={selectedPodcast.imageUrlHash}
				categories={selectedPodcast.categories}
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

			<div className={styles.podcastContent}>
			<EpisodeList currentPodcastPlaying={currentPodcastPlaying} onEpisodeSelect={onEpisodeSelect} podcastInfo={selectedPodcast} episodes={selectedPodcast.episodes} />
				{/*
				<Tabs>
					<Tab title="Episodes" active link={'/podcast/' + selectedPodcast.path}>
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
					</Tab>

					<Tab title="Reviews" link={'/podcast/' + selectedPodcast.path + '/reviews'} badge={3}>
						<ReviewPane podcast={selectedPodcast} />
					</Tab>
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

				</Tabs>
				*/}
			</div>
			{/*
				<div className={styles.headline}>Podcasts like this</div>
				<div style={{ paddingLeft: '30px', marginBottom: '30px' }}>... Coming soon!</div>
			*/}
		</div>
	);
}
export default PodCastPaneUI;