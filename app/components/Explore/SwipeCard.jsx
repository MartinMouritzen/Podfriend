import React, { useEffect, useState } from 'react';

import styles from './SwipeExplorer.css';

import TinderCard from 'react-tinder-card';

import { FaPlay, FaPause, FaMapMarkerAlt } from 'react-icons/fa';

const SwipeCard = ({episode, swiped, outOfFrame, playAudio, stopAudio }) => {
	const [showInfo,setShowInfo] = useState(false);
	const [isPlaying,setIsPlaying] = useState(false);

	const onPreviewClick = (event) => {
		if (isPlaying) {
			stopAudio();
			setIsPlaying(false);
		}
		else {
			playAudio(episode.enclosureUrl);
			setIsPlaying(true);
		}
		event.preventDefault();
		return false;
	};

	const clickInfo = () => {
		setShowInfo(!showInfo);
	};

	const onSwipe = (dir) => {
		stopAudio();
		swiped(dir,episode.id);
	};

	return (
		<TinderCard
			className={styles.swipe}
			key={episode.id}
			onSwipe={onSwipe}
			onCardLeftScreen={() => outOfFrame(episode.id)}
		>
			<div className={styles.card} style={{ backgroundColor: '#EEEEEE', backgroundImage: 'url(https://podcastcovers.podfriend.com/podfrndr/800x800/' + episode.feedImage + ')' }}>
				<div className={styles.cardInfo + (showInfo ? ' ' + styles.active : '')}>
					<div className={styles.previewButtonContainer} onTouchEnd={onPreviewClick} onClick={onPreviewClick}>
						<div className={styles.previewButton}>
							{ isPlaying &&
								<>
									<FaPause /> <span>Stop this rambling!</span>
								</>
							}
							{ !isPlaying &&
								<>
									<FaPlay /> <span>Listen to a random episode</span>
								</>
							}
						</div>
					</div>
					<div className={styles.cardInfoInner} onTouchEnd={clickInfo} onClick={clickInfo}>
						<h3>{episode.feedTitle}</h3>
						<div className={styles.description}>
							{episode.description}
						</div>
						<div className={styles.categories}>
						{ episode.categories && Object.entries(episode.categories).map(([id, categoryName]) => {
							return (
								<div key={categoryName} className={styles.categoryName}>{categoryName}</div>
							)
						} ) }
						</div>
						<div className={styles.properties}>
							<div className={styles.property}>
								<FaMapMarkerAlt /> Less than a mile away
							</div>
						</div>
					</div>
				</div>
			</div>
		</TinderCard>
	)
};
export default SwipeCard;