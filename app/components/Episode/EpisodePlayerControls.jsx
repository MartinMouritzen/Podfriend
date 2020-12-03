import React, { useEffect, useState } from 'react';

import styles from './EpisodePlayerControls.scss';

import Range from 'react-range-progress';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

const EpisodePlayerControls = ({ progress, duration }) => {
	const onProgressSliderChange = () => {

	};

	return (
		<div className={styles.playerControls}>
			<div className={styles.progress}>
				<div className={styles.progressText}>
					{TimeUtil.formatPrettyDurationText(progress)}
				</div>
				<div className={styles.progressBarOuter}>
					<Range
						value={(100 * progress) / duration}
						thumbSize={16}
						height={6}
						width="100%"
						fillColor={{
							r: 40,
							g: 189,
							b: 114,
							a: 1,
						}}
						trackColor={{
							r: 10,
							g: 10,
							b: 0,
							a: 0.5,
						}}
						onChange={onProgressSliderChange}
					/>
				</div>
				<div className={styles.durationText} title={TimeUtil.formatPrettyDurationText(duration - progress) + ' left.'}>
					{TimeUtil.formatPrettyDurationText(duration)}
				</div>
			</div>
			{/*
			<div className={styles.playerButtons}>
				buttons!
			</div>
			*/}
		</div>
	);
}
export default EpisodePlayerControls;