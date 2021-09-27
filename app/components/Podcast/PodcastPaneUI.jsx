import React, { useState, useEffect, useRef } from 'react';

import EpisodeList from './EpisodeList.jsx';

import { useLocation } from 'react-router-dom';

import Header from 'podfriend-approot/components/Header/Header.jsx';

import Badge from '@material-ui/core/Badge';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from "@material-ui/core/styles";

import styles from './PodCastPane.css';

import PodcastHeader from './PodcastHeader.jsx';
import PodcastExtras from './PodcastExtras.jsx';



const StyledBadge = withStyles(theme => ({
	badge: {
	  backgroundColor: '#0176e5',
	  color: '#FFFFFF',
	  borderRadius: '5px',
	  position: 'static',
	  transform: 'none',
	  marginLeft: '10px'
	}
  }))(Badge);

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
		
			<div ref={podcastPane} className={styles.podcastPane}>
				{/*
				<Header>
					<div>
						Test of the awesome header
					</div>
				</Header>
				*/}
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
		
	);
}
export default PodCastPaneUI;