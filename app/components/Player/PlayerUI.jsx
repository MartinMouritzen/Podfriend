import React, { useRef, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { Link, useHistory } from 'react-router-dom';

import { Range } from 'react-range';

import DOMPurify from 'dompurify';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import SVG from 'react-inlinesvg';
const FullScreenIcon = () => <SVG src={require('podfriend-approot/images/design/player/fullscreen.svg')} />;
const PlayIcon = () => <SVG src={require('podfriend-approot/images/design/player/play.svg')} />;
const PauseIcon = () => <SVG src={require('podfriend-approot/images/design/player/pause.svg')} />;
const RewindIcon = () => <SVG src={require('podfriend-approot/images/design/player/rewind.svg')} />;
const ForwardIcon = () => <SVG src={require('podfriend-approot/images/design/player/forward.svg')} />;
const MoreIcon = () => <SVG src={require('podfriend-approot/images/design/player/more.svg')} />;
const ShareIcon = () => <SVG src={require('podfriend-approot/images/design/player/share.svg')} />;
const SpeedIcon = () => <SVG src={require('podfriend-approot/images/design/player/speed.svg')} />;
const ClockIcon = () => <SVG src={require('podfriend-approot/images/design/player/clock.svg')} />;
const ChromecastIcon = () => <SVG src={require('podfriend-approot/images/design/player/chromecast.svg')} />;
const SkipForwardIcon = () => <SVG src={require('podfriend-approot/images/design/player/skip-forward.svg')} />;
const SkipBackwardIcon = () => <SVG src={require('podfriend-approot/images/design/player/skip-backward.svg')} />;

import TimeUtil from './../../library/TimeUtil.js';

import styles from './../Player.scss';

import PlayLoading from './../../images/play-button-loading.png';
import PlayLoadingWhiteBG from './../../images/play-button-loading-whitebg.png';

import { ContextMenu, ContextMenuItem } from 'podfriend-approot/components/wwt/ContextMenu/ContextMenu.jsx';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import EpisodeChapterList from 'podfriend-approot/components/Episode/Chapters/EpisodeChapterList.jsx';
import EpisodeChapters from 'podfriend-approot/components/Episode/Chapters/EpisodeChapters.jsx';
import PodcastSubtitles from 'podfriend-approot/components/Episode/PodcastSubtitles.jsx';

import { showSpeedSettingWindow } from 'podfriend-approot/redux/actions/uiActions';

import { Tabs, Tab } from 'podfriend-approot/components/wwt/Tabs/Tabs.jsx';

import DraggablePane from 'podfriend-approot/components/UI/common/DraggablePane.jsx';

/**
*
*/
const PlayerUI = ({ audioController, activePodcast, activeEpisode, title, progress, duration, playing, hasEpisode, pause, play, canPlay, isBuffering, onCanPlay, onBuffering, onLoadedMetadata, onPlay, onPause, onSeek, onTimeUpdate, onEnded, onPrevEpisode, onBackward, onNextEpisode, onForward, onProgressSliderChange, onAudioElementReady }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const audioElement = useRef(null);
	const moreIconElement = useRef(null);
	const [errorRetries,setErrorRetries] = useState(0);
	const [isVideo,setIsVideo] = useState(false);
	const [episodeOpen,setEpisodeOpen] = useState(false);
	const [description,setDescription] = useState(false);
	const [chapters,setChapters] = useState(false);
	const [chaptersLoading,setChaptersLoading] = useState(true);
	const [currentChapter,setCurrentChapter] = useState(false);
	const [subtitleFileURL,setSubtitleFileURL] = useState(false);

	useEffect(() => {
		audioController.setAudioElement(audioElement);
		onAudioElementReady();
	},[audioElement]);

	const openEpisode = (event) => {
		event.preventDefault();
		if (episodeOpen === false) {
			setEpisodeOpen(true);
		}
		else {
			history.push({
				pathname: '/podcast/' + activePodcast.path + '/',
				state: {
					podcast: activePodcast
				}
			});
			setEpisodeOpen(false);
		}
	}

	useEffect(() => {
		setErrorRetries(0);
		setSubtitleFileURL(false);
		if (activeEpisode.type === 'video/mpeg'
			|| activeEpisode.type === 'video/ogg'
			|| activeEpisode.type === 'video/webm'
			|| activeEpisode.type === 'video/mp4'
		) {
			setIsVideo(true);
		}
		else {
			setIsVideo(false);
		}
	},[activeEpisode.url]);

	const videoFullscreen = (event) => {
		if (!isVideo) {
			return;
		}
		if (event) {
			event.preventDefault();
		}
		if (audioElement && audioElement.current) {
			audioElement.current.requestFullscreen();
		}
	};

	const addUserAgentToUrl = (fileUrl) => {
		try {
			const resourceUrl = new URL(fileUrl);
			resourceUrl.searchParams.delete('_from');
			resourceUrl.searchParams.append('_from','podfriend.com');
			return resourceUrl.toString();
		}
		catch (exception) {
			console.log('addUserAgentToUrlException');
			console.log(exception);
			try {
				var fallbackUrl = fileUrl;
				if (fallbackUrl.includes('?')) {
					fallbackUrl += '&_from=podfriend.com';
				}
				else {
					fallbackUrl += '?_from=podfriend.com';
				}
			}
			catch (exception2) {
				return fileUrl;
			}
		}
	};

	const retryAudioOnError = () => {
		if (errorRetries > 3) {
			console.log('Retried audio more than 3 times. Will not try again.');
		}
		else {
			console.log('Error happened in audio stream. Retrying #' + errorRetries);
			setErrorRetries(errorRetries + 1);

			audioController.retry();
		}
	}

	const audioElementProps = {
		key: "audioPlayer",
		id: "player",
		style: { display: isVideo ? 'block' : 'none' },
		onCanPlay: onCanPlay,
		onLoadStart: onBuffering,
		onWaiting: onBuffering,
		onLoadedMetadata: onLoadedMetadata,
		ref: audioElement,
		onPlay: onPlay,
		onPause: onPause,
		onSeeked: onSeek,
		onTimeUpdate: onTimeUpdate,
		onEnded: onEnded,

		preload: "auto",
		disableremoteplayback: "true",
		onError: (error) => {
			console.log('Error happened in audio element on ' + new Date());
			console.log(error); console.log(error.nativeEvent);
			console.log(error.nativeEvent.message);
			console.log(error.nativeEvent.code);

			var errorSpecified = Object.keys(Object.getPrototypeOf(error.currentTarget.error)).find(key => error.currentTarget.error[key] === error.currentTarget.error.code);
			console.log(errorSpecified);

			// Wait half a second before retrying.
			setTimeout(() => {
				retryAudioOnError();
			},500);
		},
		onAbort: (error) => { console.log('onAbort happened in audio element'); console.log(error); console.log(error.nativeEvent); console.log(error.nativeEvent.message); console.log(error.nativeEvent.code); },
		onEmptied: (error) => { console.log('onEmptied happened in audio element'); console.log(error); console.log(error.nativeEvent); console.log(error.nativeEvent.message); console.log(error.nativeEvent.code); },
		onStalled: (error) => { console.log('onStalled happened in audio element'); console.log(error); console.log(error.nativeEvent); console.log(error.nativeEvent.message); console.log(error.nativeEvent.code); }
	};

	const loadChapters = async(url) => {
		console.log('loading chapters');
		let result = false;
		try {
			result = await fetch(url);
		}
		catch(exception) {
			url = 'https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(url);
			result = await fetch(url);
		}
		result = await result.json();

		try {
			if (result.chapters && result.chapters.length > 0) {
				setChapters(result.chapters);
				setChaptersLoading(false);
			}
		}
		catch(exception) {
			console.log('Exception getting chapters from: ' + url);
			console.log(exception);
			setChaptersLoading(false);
		}
	};

	useEffect(() => {
		var foundChapter = false;

		if (activeEpisode.currentTime > 0) {
			// First we walk through to find the active chapter
			for(var i=0;i<chapters.length;i++) {
				if (chapters[i].startTime <= activeEpisode.currentTime) {
					// Let's make sure we get the latest chapter
					if (!foundChapter || foundChapter.startTime < chapters[i].startTime) {
						foundChapter = chapters[i];
					}
				}
			}
		}
		if (foundChapter !== currentChapter) {
			setCurrentChapter(foundChapter);
		}
	},[chapters,activeEpisode.currentTime]);

	useEffect(() => {
		const fetchEpisodeData = async() => {
			setChapters(false);
			// console.log('fetching activeEpisode');
			let episodeId = activeEpisode.id;
			try {
				let episode = await fetch('https://api.podfriend.com/podcast/episode/' + episodeId + '?fulltext=true');

				episode = await episode.json();
			
				var description = DOMPurify.sanitize(episode.description, {
					ALLOWED_TAGS: [
						'p','br','ol','ul','li','b'
					  ]
				});
				description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');
				setDescription(description);

				if (episode.transcriptUrl) {
					setSubtitleFileURL(episode.transcriptUrl);
				}
				if (episode.chaptersUrl) {
					loadChapters(episode.chaptersUrl);
				}
				else {
					setChaptersLoading(false);
				}
			}
			catch (exception) {
				console.log('Exception loading episode data: ' + exception);
			}
		}
		fetchEpisodeData();
	},[activeEpisode.id]);

	const showEpisodePane = () => {
		setEpisodeOpen(true);
	};
	const hideEpisodePane = () => {
		setEpisodeOpen(false);
	};

	return (
		<>
			<div className={styles.openPlayerBackground} style={{ display: (episodeOpen ? 'block' : 'none') }} onClick={() => { setEpisodeOpen(false); }} />
			<DraggablePane onOpen={showEpisodePane} onHide={hideEpisodePane} open={episodeOpen} className={(episodeOpen ? styles.episodeOpen : styles.episodeClosed) + ' ' + styles.player + (playing ? ' ' + styles.playing : ' ' + styles.notPlaying)} style={{ display: hasEpisode ? 'flex' : 'none' }}>
				<div
					className={styles.playingPreview}
					onClick={openEpisode}
				>
					<div className={styles.coverContainer} onDoubleClick={videoFullscreen}>
						{ isVideo !== false &&
							<>
								<div className={styles.fullscreenIcon} onClick={videoFullscreen}><FullScreenIcon /></div>
								<video {...audioElementProps}>
									<source src={addUserAgentToUrl(activeEpisode.url)} type={activeEpisode.type ? activeEpisode.type : 'audio/mpeg'} />
								</video>
							</>
						}
						{ isVideo === false &&
							<>
								<audio {...audioElementProps}>
									<source src={addUserAgentToUrl(activeEpisode.url)} type={activeEpisode.type ? activeEpisode.type : 'audio/mpeg'} />
								</audio>

								{ chapters !== false &&
									<EpisodeChapters chapters={chapters} progress={activeEpisode.currentTime} />
								}
								<PodcastImage
									podcastPath={activePodcast.path}
									width={600}
									height={600}
									imageErrorText={activePodcast.name}
									fallBackImage={activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image}
									src={activeEpisode.image ? activeEpisode.image : activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image}
									className={styles.cover}
								/>

							</>
						}
					</div>
					<div className={styles.playingText}>
						{ episodeOpen && subtitleFileURL !== false &&
							<PodcastSubtitles subtitleFileURL={subtitleFileURL} progress={activeEpisode.currentTime} />
						}
						<div className={styles.title} dangerouslySetInnerHTML={{__html: title}} />
						<div className={styles.author}>
							{activePodcast.name}
						</div>
					</div>
				</div>
				<div className={styles.controls}>
					<div className={styles.progress}>
						<div className={styles.progressText}>
							{TimeUtil.formatPrettyDurationText(progress)}
						</div>
						<div className={styles.progressBarOuter}>
						<Range
							step={0.1}
							values={[(100 * progress) / duration]}
							min={0}
							max={100}
							renderTrack={({ props, children }) => (
								<div
									onMouseDown={(event) => { props.onMouseDown(event); }}
									onTouchStart={(event) => { props.onTouchStart(event); }}
									style={{
										...props.style,
										height: episodeOpen ? '36px' : '24px',
										width: '100%',
										display: 'flex'
									}}
								>
									<div
										ref={props.ref}
										style={{
											height: '6px',
											width: '100%',
											alignSelf: 'center',
											backgroundColor: 'rgba(10, 10, 0, 0.5)'
										}}
									>
										{children}
									</div>
								</div>
								)}
								renderThumb={({ props, isDragged }) => (
								<div
									{...props}
									style={{
										...props.style,
										height: '16px',
										width: '16px',
										borderRadius: '50%',
										backgroundColor: '#FFFFFF',
										transition: 'all 0.3s',
										boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
									}}
								/>
						)}
						onChange={(values) => { onProgressSliderChange(values[0],false); }}
					/>

							{/*
							<ProgressBar
								progress={progress}
								duration={duration}
								onProgressSliderChange={onProgressSliderChange}
							/>*/}
						</div>
						<div className={styles.durationText} title={TimeUtil.formatPrettyDurationText(duration - progress) + ' left.'}>
							{TimeUtil.formatPrettyDurationText(duration)}
						</div>
					</div>
					<div className={styles.audioButtons}>
						<div className={styles.fillerButton}>&nbsp;</div>
						<div className={styles.fastBackwardButton} onClick={onPrevEpisode}><SkipBackwardIcon /></div>
						<div className={styles.backwardButton} onClick={onBackward}><RewindIcon /></div>
						{ isBuffering &&
							<div key="playButton" className={styles.playButton} onClick={pause}>
								{ episodeOpen && 
									<img src={PlayLoadingWhiteBG} style={{ width: '70px', height: '70px' }}/>
								}
								{ episodeOpen === false && 
									<img src={PlayLoading} style={{ width: '70px', height: '70px' }}/>
								}
							</div>
						}
						{ canPlay && !playing &&
							<div key="playButton" className={styles.playButton} onClick={play}><PlayIcon /></div>
						}
						{ canPlay && playing &&
							<div key="playButton" className={styles.pauseButton} onClick={pause}><PauseIcon /></div>
						}
						
						<div className={styles.forwardButton} onClick={onForward}><ForwardIcon /></div>
						<div className={styles.fastForwardButton} onClick={onNextEpisode}><SkipForwardIcon /></div>
						<div className={styles.moreControlsButton} ref={moreIconElement}><MoreIcon /></div>
					</div>
				</div>
				<div className={styles.volumeControls}>
					{ /*
					{ this.props.volume === 0 &&
						<FaVolumeMute size='20px' />
					}
					{ this.props.volume > 0 && this.props.volume <= 60 &&
						<FaVolumeDown size='20px' />
					}
					{ this.props.volume > 60 &&
						<FaVolumeUp size='20px' />
					}
					<Range
					value={this.props.volume}
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
					onChange={this.onVolumeSliderChange}
					/>
					*/ }
				</div>
				{ episodeOpen &&
					<div className={styles.episodeInfo}>
						<div className={styles.blueFiller}>
							<div style={{ height: '80px', overflow: 'hidden' }} >
								<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
									<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
								</svg>
							</div>
						</div>
						{ chapters !== false &&
							<div style={{ padding: 20 }}>
								<div>Chapters</div>
								<EpisodeChapterList chapters={chapters} currentChapter={currentChapter} />
							</div>
						}
					</div>
				}

			</DraggablePane>
			{ episodeOpen === false && 
				<div className={styles.bottomProgressBar}>
					<div className={styles.bottomProgressBarInner} style={{ width: ((100 * progress) / duration) + '%' }}>
						&nbsp;
					</div>
				</div>
			}
			<ContextMenu element={moreIconElement} showTrigger="click" position='top'>
				<ContextMenuItem onClick={() => { dispatch(showSpeedSettingWindow()); }}><SpeedIcon /> Set audio speed</ContextMenuItem>
				{/*
				<ContextMenuItem><ShareIcon /> Share episode</ContextMenuItem>
				<ContextMenuItem><ClockIcon /> Set sleep timer</ContextMenuItem>
				<ContextMenuItem><ChromecastIcon /> Chromecast</ContextMenuItem>
				*/}
			</ContextMenu>
		</>
	);
}

export default PlayerUI;