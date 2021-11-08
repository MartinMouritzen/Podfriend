import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Link, useHistory, useLocation } from 'react-router-dom';

import DOMPurify from 'dompurify';

import { FaListAlt } from 'react-icons/fa';

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
const ChatIcon = () => <SVG src={require('podfriend-approot/images/design/player/chat.svg')} />;
const ChromecastIcon = () => <SVG src={require('podfriend-approot/images/design/player/chromecast.svg')} />;
const SkipForwardIcon = () => <SVG src={require('podfriend-approot/images/design/player/skip-forward.svg')} />;
const SkipBackwardIcon = () => <SVG src={require('podfriend-approot/images/design/player/skip-backward.svg')} />;
const ErrorIcon = () => <SVG src={require('podfriend-approot/images/design/player/error.svg')} />;
const SearchIcon = () => <SVG src={require('podfriend-approot/images/design/icons/search.svg')} />;
const BoostIcon = () => <SVG src={require('podfriend-approot/images/design/player/boost.svg')} />;

import Reward from 'react-rewards';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import styles from './Player.scss';

import PlayLoading from './../../images/play-button-loading.png';
import PlayLoadingWhiteBG from './../../images/play-button-loading-whitebg.png';

import { ContextMenu, ContextMenuItem } from 'podfriend-approot/components/wwt/ContextMenu/ContextMenu.jsx';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import PodcastFeed from 'podfriend-approot/library/PodcastFeed.js';

import EpisodeChapters from 'podfriend-approot/components/Episode/Chapters/EpisodeChapters.jsx';
import PodcastSubtitles from 'podfriend-approot/components/Episode/Subtitles/PodcastSubtitles.jsx';
import { synchronizeWallet, showFullPlayer, showSpeedSettingWindow, showShareWindow, showSleepTimer, hideSleepTimer } from 'podfriend-approot/redux/actions/uiActions';

import DraggablePane from 'podfriend-approot/components/UI/common/DraggablePane.jsx';

// const IndividualBoostModal = lazy(() => import('podfriend-approot/components/Wallet/IndividualBoostModal.jsx'));
import IndividualBoostModal from 'podfriend-approot/components/Wallet/IndividualBoostModal.jsx';

import ValueConfigModal from 'podfriend-approot/components/Wallet/ValueConfigModal/ValueConfigModal.jsx';

import ChatProvider from 'podfriend-approot/components/Chat/ChatProvider.jsx';
import ChatModal from 'podfriend-approot/components/Chat/ChatModal.jsx';
import SleepTimerModal from './SleepTimerModal.jsx';

import OpenPlayerUI from './OpenPlayerUI.jsx';

import ProgressBarSlider from './ProgressBarSlider.jsx';
import VolumeSlider from './VolumeSlider.jsx';

import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import PlayerEpisodeList from './PlayerEpisodeList/PlayerEpisodeList.jsx';
import EpisodeList from 'podfriend-approot/components/Podcast/EpisodeList.jsx';

import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';
import EpisodeChapterList from 'podfriend-approot/components/Episode/Chapters/EpisodeChapterList.jsx';

import EpisodeCommentList from 'podfriend-approot/components/Episode/Comments/EpisodeCommentList.jsx';

const Value4ValueModal = lazy(() => import('podfriend-approot/components/Wallet/Value4ValueModal.jsx'));
// import Value4ValueModal from 'podfriend-approot/components/Wallet/Value4ValueModal.jsx';

/**
*
*/

const PlayerUI = ({ audioController, activePodcast, activeEpisode, title, progress, duration, playing, hasEpisode, pause, play, canPlay, isBuffering, onCanPlay, onBuffering, onLoadedMetadata, onLoadedData, onPlay, onPause, onSeek, onTimeUpdate, onEnded, onPrevEpisode, onBackward, onNextEpisode, onForward, onProgressSliderChange, onAudioElementReady, onTimerChanged, playingValuePodcast, streamPerMinuteAmount, boostAmount, onBoost, setCurrentTime }) => {
	const dispatch = useDispatch();

	const history = useHistory();
	const audioElement = useRef(null);
	const moreIconElement = useRef(null);
	const rewardElement = useRef(null);

	const [episodeTitle,setEpisodeTitle] = useState(title);

	const [errorRetries,setErrorRetries] = useState(0);
	const [isVideo,setIsVideo] = useState(false);
	const [episodeOpen,setEpisodeOpen] = useState(false);
	const [description,setDescription] = useState('');
	const [showNotes,setShowNotes] = useState(false);
	const [chapters,setChapters] = useState(false);
	const [chaptersLoading,setChaptersLoading] = useState(true);
	const [currentChapter,setCurrentChapter] = useState(false);
	const [subtitleFileURL,setSubtitleFileURL] = useState(false);
	const [chatShown,setChatShown] = useState(false);
	const [error,setError] = useState(false);
	const [errorText,setErrorText] = useState(false);

	const [supportsComments,setSupportsComments] = useState(false);

	const [segmentVisible,setSegmentVisible] = useState('playing');

	const [rssFeed,setRSSFeed] = useState(false);
	const [rssFeedCurrentEpisode,setRssFeedCurrentEpisode] = useState(false);

	const [transcriptSearchOpen,setTranscriptSearchOpen] = useState(false);

	const [showIndividualBoostModal,setShowIndividualBoostModal] = useState(false);
	
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const fullPlayerOpen = useSelector((state) => state.ui.showFullPlayer);
	const showSleepTimerWindow = useSelector((state) => state.ui.showSleepTimerWindow);
	const value4ValueOnboarded = useSelector((state) => state.settings.value4ValueOnboarded);
	const value4ValueEnabled = useSelector((state) => state.settings.value4ValueEnabled);

	useEffect(() => {
		audioController.setAudioElement(audioElement);
		onAudioElementReady();
	},[audioElement]);

	useEffect(() => {
		console.log('checking if the feed supports comments');
		console.log(rssFeed);
		if (rssFeed && rssFeed.supportsComments()) {
			setSupportsComments(true);
		}
		else {
			setSupportsComments(false);
		}
	},[rssFeed]);

	const onTranscriptSearchClose = () => {
		setTranscriptSearchOpen(false);
	};

	const [boostPending,setBoostPending] = useState(false);
	const onBoostClick = () => {
		setBoostPending(true);

		onBoost()
		.then((status) => {
			if (status.success === 1) {
				setBoostPending(false);
				rewardElement.current.rewardMe();
				dispatch(synchronizeWallet());
			}
			else {
				setBoostPending(false);
				console.log(status);
				rewardElement.current.punishMe();
			}
		})
		.catch((error) => {
			console.log('Error boosting');
		});
	};

	const onIndividualBoostModalToggle = () => {
		console.log('setShowIndividualBoostModal');
		setShowIndividualBoostModal(true);
	};
	const hideIndividualBoostModal = () => {
		console.log('close');
		setShowIndividualBoostModal(false);
	};

	const openPodcast = (event) => {
		history.push({
			pathname: '/podcast/' + activePodcast.path + '/',
			state: {
				podcast: activePodcast
			}
		});
		dispatch(showFullPlayer(false));
	}

	const openEpisode = (event) => {
		if (!hasEpisode) {
			return;
		}
		event.preventDefault();
		if (fullPlayerOpen === false) {
			// setEpisodeOpen(true);
			dispatch(showFullPlayer(true));
		}
		else {
			/*
			history.push({
				pathname: '/podcast/' + activePodcast.path + '/',
				state: {
					podcast: activePodcast
				}
			});
			*/
			// setEpisodeOpen(false);
			dispatch(showFullPlayer(false));
		}
	}

	const removeSeasonInfoFromString = (string) => {
		// This function should also see if it can grab season and episode data, so that if it's not defined in rss we can show it still
		// console.log('String 1: ' + string);
		const regex = /([Ss])([0-9]{1,2}) /i;
		string = string.replace(regex,'');

		const regex2 = /([Ee])([Pp])([0-9]{1,2}) /i;
		string = string.replace(regex2,'');

		const regex3 = /([Ee])([0-9]{1,2}) /i;
		string = string.replace(regex3,'');

		string.trim();

		if (string.substring(0,2) === '- ') {
			string = string.substring(2);
		}

		// console.log('String 2: ' + string);

		return string;
	};

	useEffect(() => {
		var useEpisodeTitle = '';
		if (activeEpisode.season) {
			useEpisodeTitle += 'S' + activeEpisode.season;
		}
		if (activeEpisode.episodeNumber) {
			if (activeEpisode.season) {
				useEpisodeTitle += ':';
			}
			useEpisodeTitle += 'E' + activeEpisode.episodeNumber;
		}
		if (activeEpisode.season || activeEpisode.episodeNumber) {
			useEpisodeTitle += ' - ';
		}
		useEpisodeTitle += removeSeasonInfoFromString(title);

		setEpisodeTitle(useEpisodeTitle);
	},[title]);

	useEffect(() => {
		setError(false);
		setErrorText(false);
		setErrorRetries(0);
		setSubtitleFileURL(false);
		setSegmentVisible('playing');
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
			resourceUrl.searchParams.append('_guid',activeEpisode.statsId);
			return resourceUrl.toString();
		}
		catch (exception) {
			console.log('addUserAgentToUrlException');
			console.log(exception);
			try {
				var fallbackUrl = fileUrl;
				if (fallbackUrl.includes('?')) {
					fallbackUrl += '&_from=podfriend.com&_guid=' + activeEpisode.statsId;
				}
				else {
					fallbackUrl += '?_from=podfriend.com&_guid=' + activeEpisode.statsId;
				}
				return fallbackUrl;
			}
			catch (exception2) {
				return fileUrl;
			}
		}
	};

	const [valueConfigShown,setValueConfigShown] = useState(false);

	const showValueConfigModal = () => {
		setValueConfigShown(true);
	};
	const hideValueConfigModal = () => {
		setValueConfigShown(false);
	};

	const enableChromeCast = () => {
		console.log('ENABLE CHROMECAST');
	};

	const retryAudioOnError = () => {
		if (errorRetries >= 3) {
			console.log('Retried audio more than 3 times. Will not try again.');
			setError(true);
			setErrorText('Could not load audio file.');
		}
		else {
			console.log('Error happened in audio stream. Retrying #' + errorRetries);
			setErrorRetries(errorRetries + 1);

			audioController.retry();
		}
	}
	const startRetry = () => {
		setError(false);
		setErrorText(false);
		setErrorRetries(0);
		play();
	};

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
		onLoadedData: () => { onLoadedData },

		preload: "auto",
		disableremoteplayback: "true",
		onError: (error) => {
			console.log('Error happened in audio element on ' + new Date());
			console.log(error); console.log(error.nativeEvent);
			console.log(error.nativeEvent.message);
			console.log(error.nativeEvent.code);
			console.log(error.currentTarget);

			// var errorSpecified = Object.keys(Object.getPrototypeOf(error.currentTarget.error)).find(key => error.currentTarget.error[key] === error.currentTarget.error.code);
			// console.log(errorSpecified);

			// Wait half a second before retrying.
			setTimeout(() => {
				retryAudioOnError();
			},1000);
		},
		onAbort: (error) => { console.log('onAbort happened in audio element'); console.log(error); console.log(error.nativeEvent); console.log(error.nativeEvent.message); console.log(error.nativeEvent.code); },
		onEmptied: (error) => { console.log('onEmptied happened in audio element'); console.log(error); console.log(error.nativeEvent); console.log(error.nativeEvent.message); console.log(error.nativeEvent.code); },
		onStalled: (error) => { console.log('onStalled happened in audio element'); console.log(error); console.log(error.nativeEvent); console.log(error.nativeEvent.message); console.log(error.nativeEvent.code); }
	};

	const loadChapters = async(url) => {
		// console.log('loading chapters');
		let result = false;

		try {
			result = await fetch(url);
		}
		catch(exception) {
			// console.error('Cors probably missing on chapters, using proxy');
			url = 'https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(url);

			try {
				result = await fetch(url);
			}
			catch(exception2) {
				console.error('Proxy call to chapters failed.');
				console.error(exception2);
			}
		}
		try {
			let resultJson = await result.json();

			try {
				if (resultJson.chapters && resultJson.chapters.length > 0) {
					setChapters(resultJson.chapters);
					setChaptersLoading(false);
				}
			}
			catch(exception) {
				console.error('Exception getting chapters from: ' + url);
				console.error(exception);
				setChaptersLoading(false);
			}
		}
		catch(exception) {
			console.error('Exception parsing chapters');
			console.error(exception);
			console.error(url);
			console.error(result);
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
		if (rssFeedCurrentEpisode !== false) {
			var description = DOMPurify.sanitize(rssFeedCurrentEpisode['description'], {
				ALLOWED_TAGS: [
					'a','p','br','ol','ul','li','b'
					]
			});
			// console.log(rssFeedCurrentEpisode['description']);
			// console.log(description);
			description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');
			setDescription(description);

			if (rssFeedCurrentEpisode.showNotes) {
				var showNotes = DOMPurify.sanitize(rssFeedCurrentEpisode.showNotes, {
					ALLOWED_TAGS: [
						'a','p','br','ol','ul','li','b'
						]
				});
				const regex = /(([0-9]{1,2}):([0-9]{1,2}):?([0-9]{1,2})?)/gs;
				showNotes = showNotes.replace(regex,'<a href=\'#\' class="timestampLink">$1</a>');
				setShowNotes(showNotes);
			}

			if (rssFeedCurrentEpisode.chaptersUrl) {
				loadChapters(rssFeedCurrentEpisode.chaptersUrl);
			}
			else {
				setChaptersLoading(false);
			}

			if (rssFeedCurrentEpisode.transcript) {
				// console.log('Episode has transcript');
				var useTranscript = rssFeedCurrentEpisode.transcript;
				if (useTranscript && useTranscript.length) {
					for (var i=0;i< rssFeedCurrentEpisode.transcript.length;i++) {
						if (rssFeedCurrentEpisode.transcript[i].type === 'application/srt' || rssFeedCurrentEpisode.transcript[i].type === 'text/srt') {
							useTranscript = rssFeedCurrentEpisode.transcript[i];
							break;
						}
					}
				}
				if (useTranscript) {
					setSubtitleFileURL(useTranscript.url);
				}
			}
		}
	},[rssFeedCurrentEpisode]);

	useEffect(() => {
		setSubtitleFileURL(false);
		setChapters(false);
		setRSSFeed(false);
		setRssFeedCurrentEpisode(false);
		setDescription('');
		setShowNotes(false);

		const fetchEpisodeData = async() => {
			var podcastFeed = new PodcastFeed(activePodcast.feedUrl);
			podcastFeed.parse()
			.then((feed) => {
				setRSSFeed(feed);

				// console.log(activeEpisode);
				// console.log(feed.items[0]);
				
				var foundEpisode = false;

				for(var i=0;i<feed.items.length;i++) {
					if (activeEpisode.guid == feed.items[i].guid) {
						foundEpisode = true;
						setRssFeedCurrentEpisode(feed.items[i]);
						break;
					}
				}

				if (!foundEpisode) {
					console.log('Did not find episode in RSS Feed.');
					setChaptersLoading(false);
				}

			})
			.catch((error) => {
				console.error('Error parsing RSS feed: ');
				console.error(error);
			});
			/*
			// console.log('fetching activeEpisode');
			let episodeId = activeEpisode.id;
			try {
				let episode = await fetch('https://api.podfriend.com/podcast/episode/' + episodeId + '?fulltext=true');

				episode = await episode.json();

				// console.log('episode data');
				// console.log(episode);
			
				var description = DOMPurify.sanitize(episode.description, {
					ALLOWED_TAGS: [
						'a','p','br','ol','ul','li','b'
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
			*/
		}
		if (activeEpisode && activeEpisode.id) {
			fetchEpisodeData();
		}
	},[activeEpisode.id]);

	const showEpisodePane = () => {
		// setEpisodeOpen(true);
		dispatch(showFullPlayer(true));
	};
	const hideEpisodePane = () => {
		// setEpisodeOpen(false);
		dispatch(showFullPlayer(false));
	};

	const toggleChat = () => {
		setChatShown(!chatShown);
	};

	const generateTimeHash = () => {
		return '#t=' + Math.round(activeEpisode.currentTime ? activeEpisode.currentTime : 0);
	};

	if (activeEpisode.guid === undefined) {
		return (
			<div className={styles.noEpisodePlayer + ' ' + styles.episodeClosed + ' ' + styles.player}>
				When you start a podcast it will appear here.
			</div>
		);
	}

	return (
		<>
			{ isLoggedIn === true && value4ValueOnboarded !== true && playingValuePodcast === true && value4ValueEnabled !== true &&
				<Suspense fallback={<></>}>
					<Value4ValueModal
					
					/>
				</Suspense>
			}
			<div className={styles.openPlayerBackground} style={{ display: (fullPlayerOpen ? 'block' : 'none') }} onClick={() => { dispatch(showFullPlayer(false)); }} />
			<DraggablePane onOpen={showEpisodePane} onHide={hideEpisodePane} open={fullPlayerOpen} className={(fullPlayerOpen ? styles.episodeOpen : styles.episodeClosed) + ' ' + styles.player + (playing ? ' ' + styles.playing : ' ' + styles.notPlaying)} style={{ display: hasEpisode ? 'flex' : 'flex' }}>
				<div className={styles.segment + ' ' + styles.segmentPlaying + ' ' + (segmentVisible === 'playing' || !fullPlayerOpen ? styles.segmentVisible : styles.segmentHidden) }>
					<div
						className={styles.playingPreview}
						onClick={openEpisode}
					>
						<div className={styles.coverContainer} onDoubleClick={videoFullscreen}>
							{ audioController.useBrowserAudioElement && isVideo !== false &&
								<>
									<div className={styles.fullscreenIcon} onClick={videoFullscreen}><FullScreenIcon /></div>
									<video {...audioElementProps}>
										<source src={addUserAgentToUrl(activeEpisode.url) + generateTimeHash()} type={activeEpisode.type ? activeEpisode.type : 'audio/mpeg'} />
									</video>
								</>
							}
							{ isVideo === false &&
								<>
									{ audioController.useBrowserAudioElement === true &&
										<audio {...audioElementProps}>
											<source src={addUserAgentToUrl(activeEpisode.url) + generateTimeHash()} type={activeEpisode.type ? activeEpisode.type : 'audio/mpeg'} />
										</audio>
									}

									{ chapters !== false &&
										<EpisodeChapters audioController={audioController} chapters={chapters} progress={activeEpisode.currentTime} />
									}
									{ activeEpisode &&
										<PodcastImage
											podcastPath={activePodcast.path}
											width={600}
											height={600}
											imageErrorText={activePodcast.name}
											fallBackImage={activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image}
											src={activeEpisode.image ? activeEpisode.image : activePodcast.artworkUrl600 ? activePodcast.artworkUrl600 : activePodcast.image}
											className={styles.cover}
										/>
									}

								</>
							}
							<div className={styles.subtitleContainer} style={{ display: (fullPlayerOpen && subtitleFileURL !== false) ? 'block' : 'none' }}>
								<PodcastSubtitles subtitleFileURL={subtitleFileURL} progress={activeEpisode.currentTime} episodeOpen={fullPlayerOpen} searchOpen={transcriptSearchOpen} onTranscriptSearchClose={onTranscriptSearchClose} />
							</div>
						</div>
						<div className={styles.playingText}>
							<div className={styles.title} dangerouslySetInnerHTML={{__html: episodeTitle}} />
							<div className={styles.author} onClick={openPodcast}>
								{activePodcast.name}
							</div>
						</div>
					</div>
					{ hasEpisode && 
						<div className={styles.controls + ' ' + (error ? styles.errorPlaying : '')}>
							<div className={styles.progress}>
								<div className={styles.progressText}>
									{TimeUtil.formatPrettyDurationText(progress)}
								</div>
								<div className={styles.progressBarOuter}>
									<ProgressBarSlider
										progress={progress}
										duration={duration}
										fullPlayerOpen={fullPlayerOpen}
										onProgressSliderChange={onProgressSliderChange}
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
								{ false && 
									<div className={styles.chatButton} onClick={toggleChat}><ChatIcon /></div>
								}
								{ false &&
									<div className={styles.boostButton} onClick={onBoostClick}>
										<Reward
											ref={rewardElement}
											type='confetti'
											config={{
												zIndex: 1000,
												lifeTime: 800
											}}
										>
											<BoostIcon />
										</Reward>
									</div>
								}
								{ true && 
									<div className={styles.chatButton}>&nbsp;</div>
								}
								<div className={styles.fastBackwardButton} onClick={onPrevEpisode}><SkipBackwardIcon /></div>
								<div className={styles.backwardButton} onClick={onBackward}><RewindIcon /></div>

								{ error === true &&
									<>
										<div key="playButton" className={styles.playButton + ' ' + styles.errorButton} onClick={startRetry}>
											<ErrorIcon />
										</div>
										<div className={styles.errorText}>
											{errorText ? errorText : 'Could not load audio.'}
										</div>
									</>
								}
								{ error === false &&
									<>
										{ isBuffering &&
											<div key="playButton" className={styles.playButton} onClick={pause}>
												{ fullPlayerOpen && 
													<img src={PlayLoadingWhiteBG} style={{ width: '70px', height: '70px' }}/>
												}
												{ fullPlayerOpen === false && 
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
									</>
								}
								
								<div className={styles.forwardButton} onClick={onForward}><ForwardIcon /></div>
								<div className={styles.fastForwardButton} onClick={onNextEpisode}><SkipForwardIcon /></div>
								<div className={styles.moreControlsButton} ref={moreIconElement}><MoreIcon /></div>
							</div>
						</div>
					}
					{ audioElement.current && 
						<VolumeSlider audioElement={audioElement.current} />
					}
					{ fullPlayerOpen &&
						<OpenPlayerUI
							rssFeed={rssFeed}
							description={description}
							showNotes={showNotes}
							activePodcast={activePodcast}
							activeEpisode={activeEpisode}
							chaptersLoading={chaptersLoading}
							chapters={chapters}
							currentChapter={currentChapter}
							playingValuePodcast={playingValuePodcast}
							value4ValueEnabled={value4ValueEnabled}
							boostAmount={boostAmount}
							streamPerMinuteAmount={streamPerMinuteAmount}
							onBoost={onBoost}
							setCurrentTime={setCurrentTime}
							showValueConfigModal={showValueConfigModal}
							onIndividualBoostModalToggle={onIndividualBoostModalToggle}
						/>

					}
				</div>
				{ fullPlayerOpen && (chapters !== false || supportsComments !== false) &&
					<div style={{ width: '100%', paddingLeft: 20, paddingRight: 20, maxWidth: 440 }}>
						<IonSegment value={segmentVisible} onIonChange={(e) => { setSegmentVisible(e.detail.value); console.log(e.detail.value); }} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}>
							<IonSegmentButton value="playing">
								<IonLabel>
									Playing
								</IonLabel>
							</IonSegmentButton>
							{ chapters !== false &&
								<IonSegmentButton value="chapterList">
									<IonLabel>Chapters</IonLabel>
								</IonSegmentButton>
							}
							{ supportsComments !== false &&
								<IonSegmentButton value="commentList">
									<IonLabel>Comments</IonLabel>
								</IonSegmentButton>
							}
							{/*
							<IonSegmentButton value="social">
								<IonLabel>Social</IonLabel>
							</IonSegmentButton>
							*/}
						</IonSegment>
					</div>
				}
				{ fullPlayerOpen && false &&
					<div className={styles.segment + ' ' + styles.segmentEpisodeList + ' ' + ((segmentVisible === 'episodeList' && fullPlayerOpen) ? styles.segmentVisible : styles.segmentHidden) }>
						<PlayerEpisodeList episodes={activePodcast.episodes} activeEpisode={activeEpisode} />
						{/*
						<EpisodeList
							showFilterBar={false}
							currentPodcastPlaying={activePodcast}
							podcastInfo={activePodcast}
							episodes={activePodcast.episodes}
						/>
						*/}
					</div>
				}
				{ fullPlayerOpen &&
					<div className={styles.segment + ' ' + styles.segmentChapterList + ' ' + ((segmentVisible === 'chapterList' && fullPlayerOpen) ? styles.segmentVisible : styles.segmentHidden) }>
						<div style={{ height: '80px', bottom: '1px', overflow: 'hidden' }} >
							<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
								<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
							</svg>
						</div>
						<div style={{ maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
							<div style={{ paddingLeft: 10, paddingRight: 10 }}>
								<h2>Chapters</h2>
								{ chaptersLoading === true &&
									<div>
										Fetching chapters for episode
									</div>
								}
							</div>
							{ chapters !== false &&
								<EpisodeChapterList chapters={chapters} currentChapter={currentChapter} />
							}
						</div>
					</div>
				}
				{ fullPlayerOpen && supportsComments !== false &&
					<div className={styles.segment + ' ' + styles.segmentCommentsList + ' ' + ((segmentVisible === 'commentList' && fullPlayerOpen) ? styles.segmentVisible : styles.segmentHidden) }>
						<div style={{ height: '80px', bottom: '1px', overflow: 'hidden' }} >
							<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
								<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
							</svg>
						</div>
						<div style={{ width: '100%', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
							<div style={{ paddingLeft: 10, paddingRight: 10 }}>
								<EpisodeCommentList rootType='episode' commentObject={rssFeedCurrentEpisode.commentObject} />
							</div>
						</div>
					</div>
				}
			</DraggablePane>
			{ fullPlayerOpen === false && 
				<div className={styles.bottomProgressBar}>
					<div className={styles.bottomProgressBarInner} style={{ width: ((100 * progress) / duration) + '%' }}>
						&nbsp;
					</div>
				</div>
			}
			<ContextMenu element={moreIconElement} showTrigger="click" position='top'>
				{ subtitleFileURL !== false &&
					<ContextMenuItem onClick={() => { setTranscriptSearchOpen(true); }}><SearchIcon /> Search in transcript</ContextMenuItem>
				}
				<ContextMenuItem onClick={() => { dispatch(showSpeedSettingWindow()); }}><SpeedIcon /> Set audio speed</ContextMenuItem>
				<ContextMenuItem onClick={() => { dispatch(showShareWindow()); }}><ShareIcon /> Share episode</ContextMenuItem>
				<ContextMenuItem onClick={() => { dispatch(showSleepTimer()); }}><ClockIcon /> Set sleep timer</ContextMenuItem>
				<ContextMenuItem onClick={openPodcast}><FaListAlt />Go to podcast</ContextMenuItem>
				
				{ /* <ContextMenuItem onClick={() => { enableChromeCast(); } }><ChromecastIcon /> Chromecast</ContextMenuItem> */ }
			</ContextMenu>
			{ showSleepTimerWindow &&
				<SleepTimerModal audioController={audioController} shown={showSleepTimerWindow} onDismiss={() => { dispatch(hideSleepTimer()); }} />
			}
			{ valueConfigShown &&
				<ValueConfigModal shown={valueConfigShown} onDismiss={hideValueConfigModal} />
			}
			{ chatShown &&
				<ChatProvider roomId={activePodcast.guid} chatModal={(props) => <ChatModal {...props} shown={chatShown} onDismiss={() => { setChatShown(false); }} activePodcast={activePodcast} activeEpisode={activeEpisode} />} />
			}
			{ showIndividualBoostModal &&
				<IndividualBoostModal
					shown={showIndividualBoostModal}
					onClose={hideIndividualBoostModal}
				/>
			}
		</>
	);
}

export default PlayerUI;