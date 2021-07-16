import React, { useState, useEffect, useRef } from 'react';

import DOMPurify from 'dompurify';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import FeedCard from './FeedCard.jsx';

import { format } from 'date-fns';

import styles from './FeedCard.scss';

const EpisodeCard = ({ fromName, footerTitle, whenDate, episode }) => {
	const imageUrl = episode.image ? episode.image : episode.feedImage;
	const feedImageUrl = episode.feedImage ? episode.feedImage : episode.image;
	const coverImageRef = useRef(null);

	const [vibrantColor,setVibrantColor] = useState('rgba(41, 121, 255, 0.3)');
	const [darkVibrantColor,setDarkVibrantColor] = useState('rgba(41, 121, 255, 0.3)');

	const backgroundImageSource = 'https://podcastcovers.podfriend.com/' + episode.path + '/' + 120 + 'x' + 120 + '/' + imageUrl;

	const [episodeTitle,setEpisodeTitle] = useState('Loading');
	const [episodeDescription,setEpisodeDescription] = useState('Loading');

	var datePublished = format(new Date(episode.datePublished * 1000),'MMM D, YYYY')

	const feedImage = (
		<PodcastImage
			podcastPath={episode.path}
			imageErrorText={episode.name}
			src={feedImageUrl}
			className={styles.contentPreviewInnerPodcastImage}
			width={120}
			height={120}
		/>
	);

	useEffect(() => {
		if (coverImageRef.current) {
			coverImageRef.current.crossOrigin = 'anonymous';
			coverImageRef.current.addEventListener('load',() => {
				// console.log(Vibrant);
				// console.log(coverImageRef.current);

				var vibrant = new Vibrant(coverImageRef.current);
				var swatches = vibrant.swatches();

				// console.log(swatches);
				
				var useKey = 'DarkVibrant';
				setDarkVibrantColor(`rgba(${swatches[useKey]['rgb'][0]},${swatches[useKey]['rgb'][1]},${swatches[useKey]['rgb'][2]},0.8`);
				useKey = 'Vibrant';
				setVibrantColor(`rgba(${swatches[useKey]['rgb'][0]},${swatches[useKey]['rgb'][1]},${swatches[useKey]['rgb'][2]},0.8`);
				/*
				*/
				
				/*
				for (var swatch in swatches) {
					if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
						console.log(swatch, swatches[swatch].getRgb())
					}
				}
				*/
			});
		}
	},[coverImageRef.current]);

	useEffect(() => {
		setEpisodeTitle(DOMPurify.sanitize(episode.title,{
			ALLOWED_TAGS: []
		}));
		setEpisodeDescription(DOMPurify.sanitize(episode.description,{
			ALLOWED_TAGS: ['i','em']
		}));
	},[episode.title, episode.description]);

	// console.log(episode);
/*
	return (
		<FeedCard
			fromName={episode.title}
			fromImage={feedImage}
			footerTitle={episodeTitle}
			contentText={episodeDescription}
			whenDate={'17th May'}
			episode={episode}>

			<div className={styles.contentPreview} style={{
				backgroundImage: 'url("' + backgroundImageSource + '")'
			}}>
				<div className={styles.contentPreviewInner} style={{ backgroundColor: darkVibrantColor }}>
					<PodcastImage
						podcastPath={episode.path}
						imageErrorText={episode.name}
						src={imageUrl}
						className={styles.contentPreviewInnerPodcastImage}
						width={400}
						height={400}
						imageRef={coverImageRef}
					/>
					<div className={styles.contentPreviewInnerText}>
						<div className={styles.contentType}>Episode</div>
						<h3>{episode.title}</h3>
						<div className={styles.author}>{episode.name}</div>
					</div>
				</div>
			</div>
		</FeedCard>
	);
	*/

	const episodeType = episode.episodeType ? (episode.episodeType === 'full' ? 'Episode' : episode.episodeType) : 'Episode';

	return (
		<FeedCard
			fromName={episode.title}
			fromImage={feedImage}
			footerTitle={'New episode out now'}
			whenDate={datePublished}
			episode={episode}>

			<div className={styles.contentText}>
					{episodeDescription}
				</div>
				<div className={styles.contentPreview} style={{
					backgroundImage: 'url("' + backgroundImageSource + '")'
				}}>
					<div className={styles.contentPreviewInner} style={{ backgroundColor: darkVibrantColor }}>
						<PodcastImage
							podcastPath={episode.path}
							imageErrorText={episode.name}
							src={imageUrl}
							className={styles.contentPreviewInnerPodcastImage}
							width={400}
							height={400}
							imageRef={coverImageRef}
						/>
						<div className={styles.contentPreviewInnerText}>
							<div className={styles.contentType}>{episodeType}</div>
							<h3>{episode.title}</h3>
							<div className={styles.author}>{episode.name}</div>
						</div>
					</div>
				</div>
		</FeedCard>
	);
	
}
export default EpisodeCard;