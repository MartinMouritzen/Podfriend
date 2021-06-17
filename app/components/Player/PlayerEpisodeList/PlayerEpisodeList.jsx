import React from 'react';

import { FaCheck } from 'react-icons/fa';

import { playEpisode } from "podfriend-approot/redux/actions/podcastActions";

import { useSelector, useDispatch } from 'react-redux';

import { format, distanceInWordsToNow } from 'date-fns';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import styles from './PlayerEpisodeList.scss';

const PlayerEpisodeList = ({ episodes }) => {
	const dispatch = useDispatch();

	const activePodcast = useSelector((state) => state.podcast.activePodcast);
	const activeEpisode = useSelector((state) => state.podcast.activeEpisode);
	

	const onPlay = (episodeInfo) => {
		dispatch(playEpisode(activePodcast,episodeInfo));
	};

	return (
		<div className={styles.playerEpisodeListContainer}>

<div className={styles.waveContainer}>
				<img src={Wave} className={styles.wave} />
			</div>

			{/*
			<h2>Active Episode</h2>
			<div className={styles.activeEpisodeInformation}>
				<PodcastImage
					podcastPath={activePodcast.path}
					width={120}
					height={120}
					imageErrorText={activeEpisode.title}
					src={activeEpisode.image ? activeEpisode.image : activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image}
					fallBackImage={activePodcast.artworkUrl600}
					className={styles.cover}
					asBackground={true}
				/>
				{activeEpisode.title}
			</div>
			*/}

			<h2>All episodes</h2>
			<div className={styles.list}>
				{ episodes.map((episode,index) => (
					<div className={styles.episode + ' ' + (activeEpisode.url === episode.url ? styles.activeEpisode : '') + ' ' + (episode.listened ? styles.episodeListened : '')} onClick={(event) => { onPlay(episode); }}>
						<div>
							<PodcastImage
								podcastPath={activePodcast.path}
								width={120}
								height={120}
								imageErrorText={episode.title}
								src={episode.image ? episode.image : activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image}
								fallBackImage={activePodcast.artworkUrl600}
								className={styles.cover}
								asBackground={true}
							/>
						</div>
						<div className={styles.titleContainer}>
							<div className={styles.date}>
								{format(episode.date,'MMM D, YYYY')}
							</div>
							<div className={styles.title}>
								{episode.title}
							</div>
						</div>
						{ episode.listened && 
							<div className={styles.iconContainer}>
								<div className={styles.icon}>
									<FaCheck size={20} />
								</div>
							</div>
						}
					</div>
				)) }
			</div>
		</div>
	);
};
export default PlayerEpisodeList;