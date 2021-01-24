import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { audioPaused, audioPlayRequested } from 'podfriend-approot/redux/actions/audioActions.js';

import LatestVisitedPodcasts from 'podfriend-approot/components/Lists/LatestVisitedPodcasts.jsx';
import LatestEpisodes from 'podfriend-approot/components/Lists/LatestEpisodes.jsx';
import TrendingPodcasts from 'podfriend-approot/components/Lists/TrendingPodcasts.jsx';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import logo from './../images/logo/podfriend_logo.svg';

import styles from './welcome.css';

import DOMPurify from 'dompurify';

import Warning from 'podfriend-approot/components/UI/common/Notice/Warning.jsx';

import SVG from 'react-inlinesvg';
const PlayIcon = () => <SVG src={require('podfriend-approot/images/design/player/play.svg')} />;
const PauseIcon = () => <SVG src={require('podfriend-approot/images/design/player/pause.svg')} />;

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';
import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';

const LoadingPodcastCover = () => {
	return (
		<div className='loadingCover'><img className='loadingIndicator' src={LoadingRings} /></div>
	);
};

const welcomeText = 'I am so happy you are here! Let\'s get you started listening.<br /><br />You can search for a podcast in the search field in the top, go to Podfrndr to find random podcasts or find a trending podcast below!';


const CurrentlyPlaying = () => {
	const dispatch = useDispatch();
	const activePodcast = useSelector(state => state.podcast.activePodcast);
	const activeEpisode = useSelector(state => state.podcast.activeEpisode);
	const isPlaying = useSelector(state => state.audio.isPlaying);
	const [description,setDescription] = useState(activeEpisode ? activeEpisode.description : welcomeText);

	const [progressPercentage,setProgressPercentage] = useState(0);

	useEffect(() => {
		var progressPercentage = Math.round(activeEpisode.currentTime ? (100 * activeEpisode.currentTime) / activeEpisode.duration : 0);

		if (progressPercentage > 100) {
			progressPercentage = 100;
		}
		setProgressPercentage(progressPercentage);
	},[activeEpisode.currentTime]);

	useEffect(() => {
		if (activeEpisode) {
			setDescription(DOMPurify.sanitize(description,{
				ALLOWED_TAGS: [] // we used to allow 'i','em', but it doesn't work on mobile. I'm not sure I can see a good reason to have them.
			})
			.trim());
		}
	},[activeEpisode.id]);

	const headerSubTitle = activePodcast ? 'Continue your' : 'Welcome to your';
	const headerTitle = activePodcast ? 'Current episode' : 'Podfriend Podcast Player';
	const episodeTitle = activeEpisode ? activeEpisode.title : 'Nice to meet you!';
	const podcastTitle = activePodcast ? activePodcast.name : 'Hello';
	const podcastImage = activeEpisode ? activeEpisode.image : logo;
	const showBorder = activePodcast ? true : false;
	const podcastFallbackImage = activePodcast ? (activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image) : logo;

	return (
		<div className='section waveSection'>
				<div className='sectionInner'>
					<div className='sectionSubTitle'>{headerSubTitle}</div>
					<div className='sectionTitle'>{headerTitle}</div>
					<div className='sectionRight'>
						<Link
							to={{
								pathname: '/podcast/' + activePodcast.path + '/' + activeEpisode.id,
								state: {
									podcast: activePodcast
								}
							}}
							style={{ pointerEvents: activeEpisode === false ? 'none' : 'auto' }}
						>
							<PodcastImage
								imageErrorText={activePodcast.name}
								width={400}
								height={400}
								fallBackImage={podcastFallbackImage}
								podcastPath={activePodcast.path}
								src={podcastImage ? podcastImage : activePodcast.image }
								className={ showBorder ? 'podcastCover' : 'podcastCover noBorder'}
								draggable="false"
								loadingComponent={() => { return ( <LoadingPodcastCover /> ) }}
							/>
						</Link>
						{ activeEpisode !== false &&
							<div>
								<div className='progressBar'>
									<div className='progressBarInner' style={{ width: progressPercentage + '%' }} />
								</div>
								<div className="progressBarLabel">
									{progressPercentage}% of episode listened
								</div>
							</div>
						}
					</div>
				</div>
			<div className='sectionContentStart' style={{backgroundImage: 'url("' + Wave + '")' }}>
				<div className='sectionLeftColumn'>
					<Link
						to={{
							pathname: '/podcast/' + activePodcast.path,
							state: {
								podcast: activePodcast
							}
						}}
						className='sectionContentSubTitle'
						style={{ pointerEvents: activeEpisode === false ? 'none' : 'auto' }}
					>
						{podcastTitle}
					</Link>
					<Link
						to={{
							pathname: '/podcast/' + activePodcast.path + '/' + activeEpisode.id,
							state: {
								podcast: activePodcast
							}
						}}
						className='sectionContentTitle'
						style={{ pointerEvents: activeEpisode === false ? 'none' : 'auto' }}
					>
						{episodeTitle}
					</Link>
					<div className='sectionBodyContainer'>
						<div className='sectionBody' dangerouslySetInnerHTML={{__html: description }} />
						{ activeEpisode !== false && isPlaying &&
							<div className={'button ' + styles.playButton} onClick={() => { dispatch(audioPaused()); }}><PauseIcon /> Pause episode</div>
						}
						{ activeEpisode !== false && !isPlaying &&
							<div className={'button ' + styles.playButton} onClick={() => { dispatch(audioPlayRequested()); }}><PlayIcon /> Continue episode</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

/**
*
*/
const Welcome = () => {
	const activePodcast = useSelector(state => state.podcast.activePodcast);

	return (
		<div className={'podcastPage ' + styles.homePage}>
			{ false && 
				<div>
					<Warning
						title="Notice for iPhone users"
						targetClass="appType_standalone"
						targetPlatform="ios"
						targetVersion=""
					>
						<p>You have added Podfriend to your home screen, and we love that you want to do that.</p>
						<p>However... Apple have a really weird rule that makes audio no</p>
					</Warning>
				</div>
			}
			<CurrentlyPlaying />
			{/*
			<div className={styles.welcomeMessage}>
				<img src={logo} className={styles.logo} />
				<p className={styles.paragraphHeadline}>Welcome to Podfriend, I am so happy that you're here!</p>
				<p>This program is more or less a labor of love. I love podcasts, and I've never really been able to find a podcast app where there wasn't something that I thought could be improved, so I thought I'd give it a try myself. Of course nothing is perfect, but let's see how close we can get.</p>
				<p>This is a very early release, which means you're bound to find weird, unfinished and perhaps even comical things here. Some things might make no sense at all until they're further along in development. I'll try to limit those to selected hardcore testers, but you never know, so please be patient.</p>
				<p>You might also find really annoying bugs. Sorry for that in advance. I do a lot of testing, but I'm just one person. what I can do is promise you that I will fix the bugs as soon as I can.</p>
				
				<p>I hope together, we can have great fun, because everyone needs a Podfriend! <FaHeart /></p>
				<p>Martin</p>
			</div>
			*/}

			<LatestEpisodes />

			{ activePodcast !== false &&
				<LatestVisitedPodcasts />
			}



			<TrendingPodcasts subTitle='Trending' title='Podcasts' limit={14} />

			<TrendingPodcasts subTitle='Trending' title='True Crime Podcasts' limit={14} categoryId={103} />

			<TrendingPodcasts subTitle='Trending' title='Society Podcasts' limit={14} categoryId={77} />

			<TrendingPodcasts subTitle='Trending' title='News Podcasts' limit={14} categoryId={55} />

		</div>
	);
}

export default Welcome;