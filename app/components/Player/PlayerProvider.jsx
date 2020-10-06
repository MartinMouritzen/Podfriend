import React, { Component } from 'react';

import { connect } from "react-redux";
import { updateEpisodeTime } from "podfriend-redux/actions/index";
import { audioPlayRequested, audioCanPlay, audioBuffering, audioPlaying, audioPaused } from "podfriend-redux/actions/audioActions";
import { episodeFinished, playEpisode } from "podfriend-redux/actions/podcastActions";

import sanitizeHtml from 'sanitize-html';

import Events from 'podfriend-approot/library/Events.js';

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode,
		shouldPlay: state.audio.shouldPlay,
		isPlaying: state.audio.isPlaying,
		canPlay: state.audio.canPlay,
		isBuffering: state.audio.isBuffering
	};
}
function mapDispatchToProps(dispatch) {
	return {
		episodeFinished: (podcast,episode) => { dispatch(episodeFinished(podcast,episode)); },
		updateEpisodeTime: (time) => { dispatch(updateEpisodeTime(time)); },
		playEpisode: (podcast,episode) => { dispatch(playEpisode(podcast,episode)); },
		audioPlaying: () => { dispatch(audioPlaying()); },
		audioPaused: () => { dispatch(audioPaused()); },
		audioCanPlay: () => { dispatch(audioCanPlay()); },
		audioBuffering: () => { dispatch(audioBuffering()); },
		audioPlayRequested: () => { dispatch(audioPlayRequested()); }
	};
}

/**
*
*/
class PlayerProvider extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		console.log('PlayerProvider');
		
		this.state = {
			playing: false,
			progress: this.props.activeEpisode ? (this.props.activeEpisode.currentTime ? this.props.activeEpisode.currentTime : 0) : 0,
			duration: this.props.activeEpisode ? (this.props.activeEpisode.duration ? this.props.activeEpisode.duration : 0) : 0,
			volume: 100
		};
		this.onCanPlay = this.onCanPlay.bind(this);
		this.onBuffering = this.onBuffering.bind(this);
		
		this.onProgressSliderChange = this.onProgressSliderChange.bind(this);
		this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
		this.onTimeUpdate = this.onTimeUpdate.bind(this);
		this.onEnded = this.onEnded.bind(this);
		this.onNextEpisode = this.onNextEpisode.bind(this);
		this.onPrevEpisode = this.onPrevEpisode.bind(this);
		this.changeEpisode = this.changeEpisode.bind(this);
		this.onForward = this.onForward.bind(this);
		this.onBackward = this.onBackward.bind(this);
		this.onVolumeSliderChange = this.onVolumeSliderChange.bind(this);
		this.playOrPause = this.playOrPause.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		
		this.props.audioController.player = this;
	}
	/**
	*
	*/
	componentDidMount() {
		if (this.props.activePodcast && this.props.activeEpisode) {
			this.props.audioController.setEpisode(this.props.activePodcast,this.props.activeEpisode);
		}
		if (this.props.activeEpisode && this.props.activeEpisode.currentTime) {
			this.props.audioController.setCurrentTime(this.props.activeEpisode.currentTime);
		}
		
		Events.addListener('podcastPlayRequested',() => { console.log('podcastPlayRequested is deprecated. (player.jsx)'); this.play(); },'Player');
		Events.addListener('podcastPauseRequested',() => { console.log('podcastPauseRequested is deprecated. (player.jsx)'); this.pause(); },'Player');
		Events.addListener('MediaPlayPause',() => { console.log('MediaPlayPause'); this.playOrPause(); },'Player');
		Events.addListener('MediaNextTrack',() => {	console.log('MediaNextTrack'); this.onNextEpisode(); },'Player');
		Events.addListener('MediaPreviousTrack',() => { console.log('MediaPreviousTrack'); this.onPrevEpisode(); },'Player');
	}
	/**
	*
	*/
	componentWillUnmount() {
		Events.removeListenersInGroup('Player');
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
						console.log('setting time: ' + currentTime);
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
	onPlay(event) {

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
		this.setState({
			duration: this.props.audioController.getDuration()
		});
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
	onProgressSliderChange(value) {
		var placeInTrack = value * this.state.duration / 100;
		
		this.props.audioController.pause();
		this.props.audioController.setCurrentTime(placeInTrack);
		if (this.props.shouldPlay) {
			this.props.audioController.play();
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
		console.log(event.nativeEvent);
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
			
			this.changeEpisode(prevEpisodeIndex);
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
				console.log(episode);
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
			this.props.audioController.play();
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
		else {
			this.props.audioController.pause()
			.then(() => {
				this.props.audioController.setCurrentTime(currentTime - 15);
			})
			.then(() => {
				this.props.audioController.play();
			});
		}
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
	*/
	render() {
		var hasEpisode = this.props.activePodcast ? true : false;
		
		var title = sanitizeHtml(this.props.activeEpisode ? this.props.activeEpisode.title : 'No episode selected yet.',{
			allowedTags: []
		});
		
		return React.Children.only(this.props.children);
	}
}

const ConnectedPlayerProvider = connect(
	mapStateToProps,
	mapDispatchToProps
)(PlayerProvider);


export const usePlayer = (ComponentToWrap) => {
	return class PlayerWrapper extends Component {
		// let’s define what’s needed from the `context`
		static contextTypes = {
			theme: PropTypes.object.isRequired,
		}
		render() {
			const { theme } = this.context
			// what we do is basically rendering `ComponentToWrap`
			// with an added `theme` prop, like a hook
			return (
				<ComponentToWrap {...this.props} />
			)
		}
	}
}

export default ConnectedPlayerProvider;