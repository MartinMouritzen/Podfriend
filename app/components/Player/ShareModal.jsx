import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Modal from 'podfriend-approot/components/Window/Modal';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import ShareButtons from 'podfriend-approot/components/Podcast/ShareButtons.jsx';

import styles from './ShareModal.scss';

const ShareModal = ({ onClose }) => {
	const activePodcast = useSelector((state) => state.podcast.activePodcast);
	const activeEpisode = useSelector((state) => state.podcast.activeEpisode);
	const [shareMessage,setShareMessage] = useState('');
	const [shareUrl,setShareUrl] = useState('https://web.podfriend.com/podcast/' + activePodcast.path + '/' + activeEpisode.id);
	const [includeTime,setIncludeTime] = useState(false);
	const [timeStamp,setTimeStamp] = useState(TimeUtil.formatPrettyDurationText(Math.round(activeEpisode.currentTime)));

	useEffect(() => {
		var newShareUrl = 'https://web.podfriend.com/podcast/' + activePodcast.path + '/' + activeEpisode.id;

		if (includeTime) {
			newShareUrl += '?t=' + TimeUtil.HmsToSeconds(timeStamp)
		}
		setShareUrl(newShareUrl);
	},[includeTime,timeStamp,activeEpisode]);

	useEffect(() => {
		setShareMessage('Check out this episode: ' + activeEpisode.title + ', from the podcast ' + activePodcast.name + ': ' + shareUrl);
	},[shareUrl]);

	const changeIncludeTime = (event) => {
		const target = event.target;

		setIncludeTime(target.checked);
	};

	const changeTimeStamp = (event) => {
		setTimeStamp(event.target.value);
	};

	return (
		<Modal onClose={onClose} header={<h1>Share episode</h1>}>
			<div className={'modalPage ' + styles.shareModal}>
				<div>
					<div className={styles.episodeTitle}>{activeEpisode.title}</div>
					<div className={styles.instructionLabel}>Link: </div>
					<div><input readonly className={styles.shareUrlInput} type="text" value={shareUrl} /></div>
					<div>
						<input type="checkbox" checked={includeTime} onClick={changeIncludeTime} className={styles.timeCheckbox} /> Start at <input type="text" value={timeStamp} onChange={changeTimeStamp} className={styles.timeStampInput} name={activeEpisode.currentTime} />
					</div>
					<ShareButtons
						shareUrl={shareUrl}
						podcastTitle={activePodcast.name}
						podcastPath={activePodcast.path}
						episodeId={activeEpisode.id}
						episodeTitle={activeEpisode.title}
						episodeDescription={activeEpisode.description}
						timeStamp={timeStamp}
					/>

					<div className={styles.instructionLabel}>Easy text to copy & paste: </div>
					<textarea value={shareMessage} />
				</div>
			</div>
		</Modal>
	);
};

export default ShareModal;