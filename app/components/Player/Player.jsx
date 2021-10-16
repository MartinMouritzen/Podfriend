import React, { Component } from 'react';

import { connect } from "react-redux";
import { audioPlayRequested, audioCanPlay, audioBuffering, audioPlaying, audioPaused } from "../../redux/actions/audioActions";
import { updateEpisodeTime, updateEpisodeDuration, episodeFinished, playEpisode } from "../../redux/actions/podcastActions";
import { synchronizeEpisodeState, synchronizeWallet, boostPodcast, sendValue } from "podfriend-approot/redux/actions/uiActions";

// import PodcastWallet from 'podfriend-approot/library/PodcastWallet/PodcastWallet.js';

import DOMPurify from 'dompurify';

import Events from 'podfriend-approot/library/Events.js';

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode,
		shouldPlay: state.audio.shouldPlay,
		isPlaying: state.audio.isPlaying,
		canPlay: state.audio.canPlay,
		isBuffering: state.audio.isBuffering,
		playbackSpeed: state.settings.audioPlaybackSpeed,
		walletBalance: state.ui.walletBalance,
		defaultBoost: state.settings.defaultBoost,
		defaultStreamPerMinuteAmount: state.settings.defaultStreamPerMinuteAmount,
		isLoggedIn: state.user.isLoggedIn,
		value4ValueEnabled: state.settings.value4ValueEnabled
	};
}
function mapDispatchToProps(dispatch) {
	return {
		episodeFinished: (podcast,episode) => { dispatch(episodeFinished(podcast,episode)); },
		updateEpisodeTime: (time) => { dispatch(updateEpisodeTime(time)); },
		updateEpisodeDuration: (episodeId,duration) => { dispatch(updateEpisodeDuration(episodeId,duration)); },
		playEpisode: (podcast,episode) => { dispatch(playEpisode(podcast,episode)); },
		audioPlaying: () => { dispatch(audioPlaying()); },
		audioPaused: () => { dispatch(audioPaused()); },
		audioCanPlay: () => { dispatch(audioCanPlay()); },
		audioBuffering: () => { dispatch(audioBuffering()); },
		audioPlayRequested: () => { dispatch(audioPlayRequested()); },
		sendValue: (valueBlock,totalAmount) => { return dispatch(sendValue(valueBlock,totalAmount)); },
		boostPodcast: (valueBlock,totalAmount) => { return dispatch(boostPodcast(valueBlock,totalAmount)); },
		synchronizeWallet: () => { dispatch(synchronizeWallet()); },
		synchronizeEpisodeState: () => { dispatch(synchronizeEpisodeState()); }
	};
}

let progressTimeoutId = false;
let segmentIntervalId = false;

/**
*
*/
class Player extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.state = {
			playing: false,
			progress: this.props.activeEpisode ? (this.props.activeEpisode.currentTime ? this.props.activeEpisode.currentTime : 0) : 0,
			duration: this.props.activeEpisode ? (this.props.activeEpisode.duration ? this.props.activeEpisode.duration : 0) : 0,
			volume: 100,
			sleepTimerEnabled: false,
			sleepTimerEnding: false,
			monetizeSegmentStart: false
		};
		this.onCanPlay = this.onCanPlay.bind(this);
		this.onBuffering = this.onBuffering.bind(this);
		
		this.onProgressSliderChange = this.onProgressSliderChange.bind(this);
		this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
		this.onLoadedData = this.onLoadedData.bind(this);
		this.onTimeUpdate = this.onTimeUpdate.bind(this);
		this.onEnded = this.onEnded.bind(this);
		this.onPlay = this.onPlay.bind(this);
		this.onPause = this.onPause.bind(this);
		this.onNextEpisode = this.onNextEpisode.bind(this);
		this.onPrevEpisode = this.onPrevEpisode.bind(this);
		this.changeEpisode = this.changeEpisode.bind(this);
		this.onForward = this.onForward.bind(this);
		this.onBackward = this.onBackward.bind(this);
		this.onVolumeSliderChange = this.onVolumeSliderChange.bind(this);
		this.playOrPause = this.playOrPause.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.setCurrentTime = this.setCurrentTime.bind(this);

		this.onAudioElementReady = this.onAudioElementReady.bind(this);

		this.onBoost = this.onBoost.bind(this);
		
		this.props.audioController.player = this;
		this.props.audioController.onBuffering = this.onBuffering;
		this.props.audioController.onCanPlay = this.onCanPlay;
	}
	/**
	*
	*/
	onAudioElementReady() {
		this.props.audioController.setPlaybackRate(this.props.playbackSpeed);
		if (this.props.activeEpisode.guid !== undefined) {
			this.props.audioController.setCurrentTime(this.props.activeEpisode.currentTime);
		}
	}
	/**
	*
	*/
	componentDidMount() {
		if (this.props.activePodcast && this.props.activeEpisode && this.props.activeEpisode.guid !== undefined) {
			this.props.audioController.setEpisode(this.props.activePodcast,this.props.activeEpisode,this.props.activeEpisode.currentTime);
		}
		if (this.props.activeEpisode && this.props.activeEpisode.currentTime && this.props.activeEpisode.guid !== undefined) {
			this.props.audioController.setCurrentTime(this.props.activeEpisode.currentTime);
		}
		this.props.audioController.setPlaybackRate(this.props.playbackSpeed);

		Events.addListener('podcastPlayRequested',() => { console.log('podcastPlayRequested is deprecated. (player.jsx)'); this.play(); },'Player');
		Events.addListener('podcastPauseRequested',() => { console.log('podcastPauseRequested is deprecated. (player.jsx)'); this.pause(); },'Player');
		Events.addListener('PodfriendSetCurrentTime',(param) => { if (isNaN(param)) { return; } this.setCurrentTime(param) },'Player');
		Events.addListener('MediaPlayPause',() => { console.log('MediaPlayPause'); this.playOrPause(); },'Player');
		Events.addListener('MediaNextTrack',() => {  console.log('MediaNextTrack'); this.onNextEpisode(); },'Player');
		Events.addListener('MediaPreviousTrack',() => { console.log('MediaPreviousTrack'); this.onPrevEpisode(); },'Player');
		Events.addListener('MediaRewindTrack',() => {  console.log('MediaRewingTrack'); this.onBackward(); },'Player');
		Events.addListener('MediaForwardTrack',() => {  console.log('MediaForwardTrack'); this.onForward(); },'Player');

		document.addEventListener("keydown",this.handleKeyDown);
	}
	/**
	*
	*/
	componentWillUnmount() {
		Events.removeListenersInGroup('Player');
		document.removeEventListener("keydown",this.handleKeyDown);

		this.stopSegmentTimer();
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.shouldPlay !== prevProps.shouldPlay) {
			if (this.props.shouldPlay) {
				this.__play();
			}
			else if (!this.props.shouldPlay) {
				this.__pause();
			}
		}

		if (this.props.playbackSpeed !== prevProps.playbackSpeed) {
			// console.log('changing playback speed: ' + this.props.playbackSpeed);
			this.props.audioController.setPlaybackRate(this.props.playbackSpeed);
		}

		if (this.props.activeEpisode.url !== prevProps.activeEpisode.url) {
			this.props.audioController.pause()
			.then(() => {
				this.props.audioController.setEpisode(this.props.activePodcast,this.props.activeEpisode)
				.then(() => {
					this.props.audioController.load()
					.then(() => {
						var currentTime = 0;

						if (this.props.activeEpisode.currentTime) {
							var percentageListened = (100 * this.props.activeEpisode.currentTime) / this.props.activeEpisode.duration;
							
							if (percentageListened < 95) {
								currentTime = this.props.activeEpisode.currentTime;
							}
						}
						// console.log('setting time: ' + currentTime);

						this.props.audioController.setPlaybackRate(this.props.playbackSpeed);

						this.props.audioController.setCurrentTime(currentTime)
						.then(() => {
							if (this.props.shouldPlay) {
								this.__play();
							}
						});
					});
				});
			});
			
			
			this.setState({
				progress: this.props.activeEpisode.currentTime,
				duration: this.props.activeEpisode.duration
			});
/*
			Events.emit('OnAudioPlay',{
				episode: this.props.activeEpisode.episode
			});
*/
		}
	}
	handleKeyDown(event) {
		try {
			if (event.keyCode === 32) {
				var isInputOrTextarea = false;

				if (['INPUT','TEXTAREA'].indexOf(event.srcElement.nodeName) == -1) {
					event.preventDefault();
					this.playOrPause();
				}
				// console.log('yay');
			}
		}
		catch (exception) {
			console.log('exception while handling handleKeyDown in');
			console.log(exception);
		}
	}
	/**
	*
	*/
	playOrPause() {
		if (this.props.shouldPlay || this.props.isPlaying) {
			this.pause();
		}
		else {
			this.play();
		}
	}
	/**
	*
	*/
	play() {
		this.props.audioPlayRequested();
	}
	/**
	*
	*/
	__play() {
		this.props.audioController.play();
		this.setState({
			playing: true
		});
		/*
		Events.emit('OnAudioPlay',{
			episode: this.props.activeEpisode
		});
		*/
		this.props.audioPlaying();
	}
	pause() {
		this.props.audioPaused();
	}
	/**
	*
	*/
	__pause() {
		this.props.audioController.pause();
		this.setState({
			playing: false
		});
		Events.emit('OnAudioPaused',{
			episode: this.props.activeEpisode
		});
		this.props.audioPaused();
	}
	/**
	*
	*/
	resetSegmentTime() {
		// console.log('this.props.activePodcast');
		// console.log(this.props.activePodcast);
		// if (this.props.activePodcast.value && this.props.value4ValueEnabled) {
			var currentTime = this.props.audioController.getCurrentTime();
			this.setState({
				monetizeSegmentStart: currentTime
			},() => {
				this.startNewSegmentTimer();
			});
		// }
	}
	stopSegmentTimer() {
		clearInterval(segmentIntervalId);
	}
	/**
	*
	*/
	startNewSegmentTimer() {
		clearInterval(segmentIntervalId);

		segmentIntervalId = setInterval(() => {
			this.segmentTimeTrigger();
		// },5000);
		},60000);
	}
	/**
	*
	*/
	segmentTimeTrigger() {
		if (this.props.isLoggedIn) {
			// Sync episode time

			if (this.props.isPlaying === true) {
				this.props.synchronizeEpisodeState();

				// Stream sats
				var totalAmount = 0;
				if (this.props.activePodcast.value && this.props.value4ValueEnabled) {
					// PodcastWallet.sendValue(this.props.activePodcast.value,totalAmount);
					// console.log(this.props.activePodcast);
					// console.log(this.props.activePodcast.value);
					// return false;
					

						if (this.props.walletBalance > 0) {
							console.log(this.props);
							this.props.sendValue(this.props.activePodcast.value,this.props.activePodcast.streamAmount ? this.props.activePodcast.streamAmount : this.props.defaultStreamPerMinuteAmount)
							.then(() => {
								this.props.synchronizeWallet();
							});
						}
						else {
							console.log('Streaming of sats aborted. There is less than zero satoshis in wallet.');
						}
				}
				else {
					console.log('Podcast has no value block, cannot send.');
				}
			}
		}
	}
	/**
	*
	*/
	onPlay(event) {
		this.resetSegmentTime();
	}
	/**
	*
	*/
	onCanPlay(event) {
		this.props.audioCanPlay();
	}
	/**
	*
	*/
	onBuffering() {
		this.props.audioBuffering();
	}
	/**
	*
	*/
	onPause(event) {
		this.props.synchronizeEpisodeState();
		this.stopSegmentTimer();
	}
	/**
	*
	*/
	onSeek(event) {

	}
	/**
	*
	*/
	onLoadedMetadata(event) {
		let newDuration = this.props.audioController.getDuration();
		// console.log('OnloadedMetaData. duration: ' + newDuration + ', episodeid: ' + this.props.activeEpisode.id);

		// alert(this.props.audioController.audioElement.current.currentTime);

		// alert('set time: ' + this.props.activeEpisode.currentTime);
		this.setCurrentTime(this.props.activeEpisode.currentTime);

		// alert(this.props.audioController.audioElement.current.currentTime);

		this.props.updateEpisodeDuration(newDuration);
		this.setState({
			duration: newDuration
		});
		// On IOS sometimes only this event is sent, not the onCanPlay - so we use this to signal that we can play too
		this.onCanPlay();
	}
	/**
	*
	*/
	onLoadedData(event) {
		// this.setCurrentTime(this.props.activeEpisode.currentTime);
	}
	/**
	*
	*/
	onTimeUpdate() {
		var currentTime = this.props.audioController.getCurrentTime();
		
		this.setState({
			progress: currentTime
		});
		
		this.props.updateEpisodeTime(currentTime);
	}
	/**
	*
	*/
	onProgressSliderChange(value,final) {
		var placeInTrack = value * this.state.duration / 100;

		clearTimeout(progressTimeoutId);

		// Make sure we don't overload the html5 component
		progressTimeoutId = setTimeout(() => {
			this.setCurrentTime(placeInTrack);
			this.resetSegmentTime();
	 	},100);
	}
	/**
	* 
	*/
	setCurrentTime(value) {
		// this.props.audioController.pause();
		this.props.audioController.setCurrentTime(value);

		if (this.props.shouldPlay) {
			// this.props.audioController.play();
		}
	}
	/**
	*
	*/
	onEnded(event) {
		console.log('Episode ended');
		console.log('currentTime: ' + this.props.audioController.getCurrentTime());
		console.log('duration: ' + this.props.audioController.getDuration());
		console.log(event);
		if (event && event.nativeEvent) {
			console.log(event.nativeEvent);
		}
		console.log(this.props.activeEpisode);
		
		Events.emit('OnEpisodeEnded',{
			episodeIndex: this.props.activeEpisode.episodeIndex
		});
		
		// We have to check this, because sometimes onEnded is called even if it's not done.
		var percentage = (100 * this.props.audioController.getCurrentTime()) / this.props.audioController.getDuration();
		if (percentage > 75) {
			this.props.episodeFinished(this.props.activePodcast,this.props.activeEpisode);
		}
		
		this.onNextEpisode(true);
	}
	/**
	*
	*/
	onNextEpisode(startFromBeginning = false) {
		console.log('onNextEpisode');
		var percentage = (100 * this.props.audioController.getCurrentTime()) / this.props.audioController.getDuration();
		
		if (percentage > 75) {
			console.log('onNextEpisode:episodeFinished');
			this.props.episodeFinished(this.props.activePodcast,this.props.activeEpisode);
		}
		
		var nextEpisodeIndex = this.props.activeEpisode.episodeIndex + 1;
		
		console.log('onNextEpisode:nextEpisodeIndex: ' + nextEpisodeIndex + ', shouldPlay: ' + this.props.shouldPlay + ', isPlaying: ' + this.props.isPlaying);
		this.changeEpisode(nextEpisodeIndex,startFromBeginning);
	}
	/**
	*
	*/
	onPrevEpisode() {
		console.log('onPrevEpisode');
		// If you press previous but are far ahead in the track, let's just scroll back to the start first.
		var percentage = (100 * this.props.audioController.getCurrentTime()) / this.props.audioController.getDuration();

		console.log('onPrevEpisode: percentage: ' + percentage);
		
		if (percentage > 10) {
			console.log('onPrevEpisode: resetting');
			this.props.audioController.pause()
			.then(() => {
				this.props.audioController.setCurrentTime(0);
			})
			.then(() => {
				console.log('onPrevEpisode: reset-play');
				this.props.audioController.play();
			});
		}
		else {
			var prevEpisodeIndex = this.props.activeEpisode.episodeIndex - 1;
			console.log('onPrevEpisode: prevEpisodeIndex: '+ prevEpisodeIndex);

			if (this.props.activePodcast.episodes[prevEpisodeIndex]) {
				console.log('onPrevEpisode: changeEpisode: ' + prevEpisodeIndex);
				this.changeEpisode(prevEpisodeIndex);
			}
			else {
				console.log('onPrevEpisode: changeEpisode but first episode so cannot do more');
				this.props.audioController.setCurrentTime(0);
				if (this.props.shouldPlay) {
					this.props.audioController.play();
				}
			}
		}
	}
	/**
	*
	*/
	changeEpisode(episodeIndex,startFromBeginning = false) {
		console.log('changeEpisode: ' + episodeIndex);
		var episode = this.props.activePodcast.episodes[episodeIndex];
		
		if (episode) {
			if (startFromBeginning) {
				// console.log(episode);
			}
			this.props.playEpisode(this.props.activePodcast,episode);
			
			/*
			Events.emit('OnEpisodePlaying',{
				playing: this.state.playing,
				podcast: this.props.activePodcast,
				episode: episode,
				episodeIndex: episodeIndex,
				episodeList: this.props.activePodcast.episodeList
			});
			*/
		}
		else {
			// Empty player?
		}
	}
	/**
	*
	*/
	onForward() {
		var currentTime = this.props.audioController.getCurrentTime();

		console.log('onForward test: ' + currentTime + ':' + this.props.audioController.getDuration());

		if (currentTime + 15 > this.props.audioController.getDuration()) {
			this.onNextEpisode();
		}
		else {
			this.props.audioController.pause();
			this.props.audioController.setCurrentTime(currentTime + 15);
			if (this.props.shouldPlay) {
				this.props.audioController.play();
				this.resetSegmentTime();
			}
		}
	}
	/**
	*
	*/
	onBackward() {
		var currentTime = this.props.audioController.getCurrentTime();

		var backwardTime = currentTime - 15;
		if (backwardTime < 0) {
			backwardTime = 0;
		}

		this.props.audioController.pause()
		.then(() => {
			return this.props.audioController.setCurrentTime(backwardTime);
		})
		.then(() => {
			if (this.props.shouldPlay) {
				this.props.audioController.play();
				this.resetSegmentTime();
			}
		});
	}
	/**
	*
	*/
	onVolumeSliderChange(newValue) {
		this.props.audioController.setVolume(newValue / 100);
		this.setState({
			volume: newValue
		});
	}
	/**
	*
	**/
	onBoost() {
		if (this.props.activePodcast.value) {
			if (this.props.walletBalance >= (this.props.activePodcast.boostAmount ? this.props.activePodcast.boostAmount : this.props.defaultBoost)) {
				let overrideDestinations = false;
				return this.props.boostPodcast(
					this.props.activePodcast.value,
					(this.props.activePodcast.boostAmount ? this.props.activePodcast.boostAmount : this.props.defaultBoost),
					overrideDestinations
				);
			}
			else {
				return Promise.resolve({
					success: 0,
					reason: 'Not enough Satoshis to boost'
				});
			}
		}
		else {
			return Promise.resolve({
				success: 0,
				reason: 'Podcast does not have a value block'
			});
		}
	}
	/**
	*
	*/
	render() {
		var PlayerUI = this.props.UI;
		
		var hasEpisode = this.props.activePodcast ? true : false;
		
		var title = DOMPurify.sanitize(this.props.activeEpisode ? this.props.activeEpisode.title : 'No episode selected yet.',{
			allowedTags: []
		});

		return (
			<PlayerUI
				hasEpisode={hasEpisode}
				audioController={this.props.audioController}

				playingValuePodcast={this.props.activePodcast.value ? true : false}

				onBoost={this.onBoost}

				playbackSpeed={this.props.playbackSpeed}

				onProgressSliderChange={this.onProgressSliderChange}
				title={title}
				progress={this.state.progress}
				duration={this.state.duration}

				onAudioElementReady={this.onAudioElementReady}
				
				activePodcast={this.props.activePodcast}
				activeEpisode={this.props.activeEpisode}
				shouldPlay={this.props.shouldPlay}
				
				onCanPlay={this.onCanPlay}
				onBuffering={this.onBuffering}
				onLoadedMetadata={this.onLoadedMetadata}
				onLoadedData={this.onLoadedData}
				
				isBuffering={this.props.isBuffering}
				
				goToPodcast={this.goToPodcast}
				play={this.play}
				pause={this.pause}
				onPlay={this.onPlay}
				onPause={this.onPause}
				onSeek={this.onSeek}
				onPrevEpisode={this.onPrevEpisode}
				onNextEpisode={this.onNextEpisode}
				onBackward={this.onBackward}
				onForward={this.onForward}
				onEnded={this.onEnded}

				canPlay={this.props.canPlay}
				playing={this.props.isPlaying}
				volume={this.state.volume}
				onTimeUpdate={this.onTimeUpdate}
				boostAmount={(this.props.activePodcast.boostAmount ? this.props.activePodcast.boostAmount : this.props.defaultBoost)}
				streamPerMinuteAmount={this.props.activePodcast.streamAmount ? this.props.activePodcast.streamAmount : this.props.defaultStreamPerMinuteAmount}
				setCurrentTime={this.setCurrentTime}
			/>
		);
	}
}

const ConnectedPlayer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Player);

export default ConnectedPlayer;