import React, { Component } from 'react';

import { connect } from "react-redux";
import { audioPlayRequested, audioCanPlay, audioBuffering, audioPlaying, audioPaused } from "../../redux/actions/audioActions";
import { updateEpisodeTime, updateEpisodeDuration, episodeFinished, playEpisode } from "../../redux/actions/podcastActions";
import { synchronizeWallet, boostPodcast, sendValue } from "podfriend-approot/redux/actions/uiActions";

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
		defaultStreamPerMinuteAmount: state.settings.defaultStreamPerMinuteAmount
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
		synchronizeWallet: () => { dispatch(synchronizeWallet()); }
	};
}

let progressTimeoutId = false;
let segmentTimeoutId = false;

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
			monetizeSegmentStart: false,
			boostAmount: this.props.defaultBoost,
			streamPerMinuteAmount: this.props.defaultStreamPerMinuteAmount
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
			this.props.audioController.setEpisode(this.props.activePodcast,this.props.activeEpisode);
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
		if (this.props.activePodcast.value) {
			var currentTime = this.props.audioController.getCurrentTime();
			this.setState({
				monetizeSegmentStart: currentTime
			},() => {
				this.startNewSegmentTimer();
			});
		}
	}
	stopSegmentTimer() {
		clearTimeout(segmentTimeoutId);
	}
	/**
	*
	*/
	startNewSegmentTimer() {
		clearTimeout(segmentTimeoutId);

		segmentTimeoutId = setInterval(() => {
			this.segmentTimeTrigger();
		// },5000);
		},60000);
	}
	/**
	*
	*/
	segmentTimeTrigger() {
		var totalAmount = 0;
		if (this.props.activePodcast.value) {
			// PodcastWallet.sendValue(this.props.activePodcast.value,totalAmount);
			// console.log(this.props.activePodcast);
			// console.log(this.props.activePodcast.value);
			// return false;
			this.props.sendValue(this.props.activePodcast.value,this.state.streamPerMinuteAmount)
			.then(() => {
				this.props.synchronizeWallet();
			});
		}
		else {
			console.log('Podcast has no value block, cannot send.');
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
		var percentage = (100 * this.props.audioController.getCurrentTime()) / this.props.audioController.getDuration();
		
		if (percentage > 75) {
			this.props.episodeFinished(this.props.activePodcast,this.props.activeEpisode);
		}
		
		var nextEpisodeIndex = this.props.activeEpisode.episodeIndex + 1;
		
		this.changeEpisode(nextEpisodeIndex,startFromBeginning);
	}
	/**
	*
	*/
	onPrevEpisode() {
		// If you press previous but are far ahead in the track, let's just scroll back to the start first.
		var percentage = (100 * this.props.audioController.getCurrentTime()) / this.props.audioController.getDuration();
		
		if (percentage > 10) {
			this.props.audioController.pause()
			.then(() => {
				this.props.audioController.setCurrentTime(0);
			})
			.then(() => {
				this.props.audioController.play();
			});
		}
		else {
			var prevEpisodeIndex = this.props.activeEpisode.episodeIndex - 1;

			if (this.props.activePodcast.episodes[prevEpisodeIndex]) {
				this.changeEpisode(prevEpisodeIndex);
			}
			else {
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
		if (currentTime - 15 < 0) {
			// this.onPrevEpisode();
			currentTime = 0;
		}

		this.props.audioController.pause()
		.then(() => {
			this.props.audioController.setCurrentTime(currentTime - 15);
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
			if (this.props.walletBalance >= this.state.boostAmount) {
				let overrideDestinations = false;
				return this.props.boostPodcast(
					this.props.activePodcast.value,
					this.state.boostAmount,
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
				boostAmount={this.state.boostAmount}
				streamPerMinuteAmount={this.state.streamPerMinuteAmount}
			/>
		);
	}
}

const ConnectedPlayer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Player);

export default ConnectedPlayer;