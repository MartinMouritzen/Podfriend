import React, { useEffect, useState } from 'react';

import styles from './EpisodeChapters.scss';

var randomColor = require('randomcolor');

const EpisodeChapter = ({ title, image, url, isActive, fadeOut }) => {
	const chapterRandomColor = randomColor({
		seed: title ? title : image ? image : url,
		luminosity: 'light',
		hue: 'blue'
	});

	return (
		<div
			className={
				styles.chapter + ' ' + (isActive ? styles.activeChapter : '') + (fadeOut ? styles.fadeOut : '')}
				style={{
					backgroundColor: (!url && !image) ? chapterRandomColor : 'transparent'
				}}
			>
			{ (!url && !image) &&
				<div className={styles.chapterTitleFull}>
					{title}
				</div>
			}
			{ (url || image) &&
				<div className={styles.chapterTitleHeader}>
					{title}
				</div>
			}
			{ url &&
				<div className={styles.linkContainer}>
					<a href={url} target="_blank">{url}</a>
				</div>
			}
			{ image && 
				<div className={styles.chapterImageOuter} style={{ backgroundImage: 'url("' + image + '")' }}>
					<div className={styles.chapterImageInner} style={{ backgroundImage: 'url("' + image + '")' }}>
						&nbsp;
					</div>
				</div>
			}
		</div>
	);
};

export default EpisodeChapter;