import React from 'react';

import styles from './EpisodeChapterList.scss';

import Events from 'podfriend-approot/library/Events.js';

const Chapter = ({ startTime, image, title, isActive }) => {
	const fancyTimeFormat = (duration) => {
		// Hours, minutes and seconds
		var hrs = ~~(duration / 3600);
		var mins = ~~((duration % 3600) / 60);
		var secs = ~~duration % 60;
	
		// Output like "1:01" or "4:03:59" or "123:03:59"
		var ret = "";
	
		if (hrs > 0) {
			ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		}
	
		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}

	const goToChapterStart = () => {
		Events.emit('PodfriendSetCurrentTime',startTime);
	};

	return (
		<div className={styles.chapter + (isActive ? ' ' + styles.activeChapter : '')} onClick={goToChapterStart}>
			<div className={styles.chapterImage}>
				{ image &&
					<img src={image} />
				}
			</div>
			<div className={styles.chapterTime}>
				{fancyTimeFormat(startTime)}
			</div>
			<div className={styles.chapterTitle}>
				{title}
			</div>
		</div>
	)
};

const EpisodeChapterList = ({ chapters, currentChapter }) => {
	return (
		<div className={styles.chapterList}>
			{ chapters.map((chapter,index) => {
				return <Chapter key={index} startTime={chapter.startTime} image={chapter.img} title={chapter.title} isActive={chapter === currentChapter} />;
			} ) }
		</div>
	);
};

export default EpisodeChapterList;