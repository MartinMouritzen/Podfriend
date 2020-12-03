import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import styles from './EpisodePane.scss';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import { Link, useParams } from "react-router-dom";

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';

import EpisodePlayerControls from './EpisodePlayerControls.jsx';


const CurrentlyPlayingPane = () => {
	let { podcastName, episodeId } = useParams();

	const [episode,setEpisode] = useState(false);

	const { activeEpisode, selectedPodcast } = useSelector((state) => {
		return {
			activeEpisode: state.podcast.activeEpisode,
			selectedPodcast: state.podcast.selectedPodcast
		};
	});

	const isActiveEpisode = activeEpisode.id == episodeId;

	useEffect(() => {
		const fetchEpisodeData = () => {
			fetch('https://api.podfriend.com/podcast/episode/' + episodeId)
			.then((episode) => {
				return episode.json();
			})
			.then((episode) => {
				console.log(episode);
				setEpisode(episode);
			})
			.catch((exception) => {
				console.log('Exception loading episode data: ' + exception);
			});
		}

		fetchEpisodeData();
	},[episodeId]);

	return (
		<div className={styles.episodePane}>
			<div className={styles.blueFiller} />
			<div className={styles.waveContainer}>
				<img src={Wave} className={styles.wave} />
			</div>
			<div className={styles.podcastCoverContainer}>
				<Link className={styles.podcastTitle} to={'/podcast/' + podcastName}>
					{ episode ? episode.feedTitle : 'Back to podcast' }
				</Link>
				{ episode !== false && 
					<Link to={'/podcast/' + podcastName}>
						<PodcastImage
							imageErrorText={episode.title}
							width={600}
							height={600}
							src={episode.image}
							fallBackImage={episode.feedImage}
							className={styles.podcastCover}
							draggable="false"
							loadingComponent={() => { return ( <div className={styles.loadingCover}><img src={LoadingRings} /></div> ) }}
						/>
					</Link>
				}
			</div>
			<div className={styles.episodeInfo}>
				{ episode !== false && 
					<>
					<div className={styles.episodeTitle}>
						{episode.title}
					</div>
					{ !isActiveEpisode && 
						<div>
							Play this episode!
						</div>
					}
					{ false && episode && isActiveEpisode &&
						<EpisodePlayerControls progress={activeEpisode.currentTime} duration={activeEpisode.duration} />
					}
					<div className={styles.description}>
						{episode.description}
					</div>
					</>
				}

				{ episode === false && 
					<div>
						Loading episode
					</div>
				}
			</div>
		</div>
	);
};

export default CurrentlyPlayingPane;