import React, { useEffect, useState } from 'react';

// import { showFullPlayer } from "podfriend-approot/redux/actions/uiActions";

// import { useDispatch } from 'react-redux';

import { format, distanceInWordsToNow } from 'date-fns';
import DOMPurify from 'dompurify';

import { FaPlay, FaPause, FaCheck } from "react-icons/fa";

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import ShareButtons from './ShareButtons.jsx';

import styles from './EpisodeList.css';

const EpisodeListItem = ({ id, title, description, episodeImage, duration, currentTime, podcast, podcastTitle, podcastPath, isActiveEpisode, listened, hideListenedEpisodes, isPlaying, episode, episodeType, selectEpisodeAndPlay, date }) => {
	// const dispatch = useDispatch();
	const [episodeTitle,setEpisodeTitle] = useState(title);
	const [episodeDescription,setEpisodeDescription] = useState(description);

	useEffect(() => {
		setEpisodeTitle(DOMPurify.sanitize(title,{
			ALLOWED_TAGS: []
		}));
		setEpisodeDescription(DOMPurify.sanitize(description,{
			ALLOWED_TAGS: ['i','em']
		}));
	},[title, description]);

	var totalMinutes = Math.round(duration / 60);
	var minutesLeft = currentTime ? Math.round((duration - currentTime) / 60) : totalMinutes;
	
	var progressPercentage = currentTime ? (100 * currentTime) / duration : 0;
	if (progressPercentage > 100) {
		progressPercentage = 100;
	}
	
	var episodeClass = styles.episode;
	if (isActiveEpisode) {
		episodeClass += ' ' + styles.episodePlaying;
	}
	if (isActiveEpisode && isPlaying) {
		episodeClass += ' ' + styles.isPlaying;
	}
	if (listened) {
		episodeClass += ' ' + styles.listened;
	}
	
	if (!isActiveEpisode && hideListenedEpisodes && listened) {
		episodeClass += ' ' + styles.hidden;
	}

	const onPlay = (event) => {
		event.stopPropagation();
		selectEpisodeAndPlay(episode);
		// dispatch(showFullPlayer(true));
	};

	return (
		<div id={'episode-' + id} key={episode.url} className={episodeClass} onClick={onPlay}>
			<PodcastImage
				podcastPath={podcastPath}
				width={120}
				height={120}
				imageErrorText={title}
				src={episodeImage}
				fallBackImage={podcast.artworkUrl600}
				className={styles.cover}
				asBackground={true}
			>
				<div className={styles.play}>
					<div className={[styles.playIcon,styles.icon].join(' ')}  onClick={onPlay}>
						<FaPlay size="18px" />
					</div>
					<div className={[styles.pauseIcon,styles.icon].join(' ')} onClick={(event) => { Events.emit('podcastPauseRequested',false); event.stopPropagation(); }}>
						<FaPause size="18px" />
					</div>
					<div className={[styles.checkIcon,styles.icon].join(' ')}>
						<FaCheck size="18px"  />
					</div>
				</div>
			</PodcastImage>
			<div className={styles.episodeInfo}>
				<div className={styles.titleAndDescription}>
					<div className={styles.title} dangerouslySetInnerHTML={{__html: episodeTitle}} />
					{ episodeType && episodeType != 'full' && episodeType !== '' &&
						<span type={episodeType} className={styles.episodeType}>{episodeType}</span>
					}
					<div className={styles.date}>
						{format(date,'MMM D, YYYY')}
						<span className={styles.agoText}>({distanceInWordsToNow(date)} ago)</span>
					</div>
					<div className={styles.description} dangerouslySetInnerHTML={{__html:episodeDescription}} />
				</div>
				<span className={styles.progress} title={('Exact episode length: ' + TimeUtil.formatPrettyDurationText(duration))}>
					<div className={styles.progressBarOuter}>
						<div className={styles.progressBarInner} style={{ width: Math.round(progressPercentage) + '%' }}/>
					</div>
					
					<span className={styles.duration}>
						{ minutesLeft == totalMinutes && 
							<span>{totalMinutes} minutes</span>
						}
						{ minutesLeft != totalMinutes && 
							<span>{Math.round((duration - currentTime) / 60)} of {totalMinutes} minutes left</span>
						}
					</span>
				</span>
				<ShareButtons podcastTitle={podcastTitle} episodeTitle={title} episodeId={id} podcastPath={podcastPath} />
			</div>
		</div>
	);
};
function episodeShouldCache(prevEpisode,nextEpisode) {
	if (nextEpisode.isActiveEpisode) { return false; }
	if (nextEpisode.title != prevEpisode.title) { return false; }
	if (nextEpisode.description != prevEpisode.description) { return false; }
	if (nextEpisode.url != prevEpisode.url) { return false; }
	if (nextEpisode.currentTime != prevEpisode.currentTime) { return false; }
	if (nextEpisode.duration != prevEpisode.duration) { return false; }
	if (nextEpisode.listened != prevEpisode.listened) { return false; }
	if (nextEpisode.isActiveEpisode != prevEpisode.isActiveEpisode) { return false; }
	if (nextEpisode.hideListenedEpisodes != prevEpisode.hideListenedEpisodes) { return false; }
	if (prevEpisode.isActiveEpisode && nextEpisode.isPlaying != prevEpisode.isPlaying) { return false; }
	if (nextEpisode.episodeImage != prevEpisode.episodeImage) { return false; }
	
	return true;
}
export default React.memo(EpisodeListItem, episodeShouldCache);
// export default EpisodeListItem;