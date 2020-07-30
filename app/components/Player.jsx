import React, { Component } from 'react';

import { connect } from "react-redux";
import { updateEpisodeTime } from "../redux/actions/index";
import { audioPlaying, audioPaused } from "../redux/actions/audioActions";
import { episodeFinished, playEpisode } from "../redux/actions/podcastActions";

import sanitizeHtml from 'sanitize-html';

import Events from './../library/Events.js';

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode
	};
}
function mapDispatchToProps(dispatch) {
	return {
		episodeFinished: (podcast,episode) => { dispatch(episodeFinished(podcast,episode)); },
		updateEpisodeTime: (time) => { dispatch(updateEpisodeTime(time)); },
		playEpisode: (podcast,episode) => { dispatch(playEpisode(podcast,episode)); },
		audioPlaying: () => { dispatch(audioPlaying()); },
		audioPaused: () => { dispatch(audioPaused()); }
	};
}

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
			canPlay: false,
			playing: false,
			progress: this.props.activeEpisode ? (this.props.activeEpisode.currentTime ? this.props.activeEpisode.currentTime : 0) : 0,
			duration: this.props.activeEpisode ? (this.props.activeEpisode.duration ? this.props.activeEpisode.duration : 0) : 0,
			volume: 100
		};
		this.onCanPlay = this.onCanPlay.bind(this);
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
		
		Events.addListener('podcastPlayRequested',() => { this.play(); },this);
		Events.addListener('podcastPauseRequested',() => { this.pause(); },this);
		Events.addListener('MediaPlayPause',() => { this.playOrPause(); },this);
		Events.addListener('MediaNextTrack',() => { this.onNextEpisode(); },this);
		Events.addListener('MediaPreviousTrack',() => { this.onPrevEpisode(); },this);
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
	}
	/**
	*
	*/
	componentWillUnmount() {
		Events.removeListenersInGroup(this);
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
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
							this.props.audioController.play();
						});
					});
				});
			});
			
			this.setState({
				playing: true,
				canPlay: false,
				progress: this.props.activeEpisode.currentTime,
				duration: this.props.activeEpisode.duration
			});

			Events.emit('OnAudioPlay',{
				episode: this.props.activeEpisode.episode
			});
		}
		/*
		else {
			if (this.state.playing) {
				// this.props.audioController.play();
			}
		}
		*/
	}
	/**
	*
	*/
	playOrPause() {
		if (this.state.playing) {
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
		this.props.audioController.play();
		this.setState({
			playing: true
		});
		Events.emit('OnAudioPlay',{
			episode: this.props.activeEpisode
		});
		this.props.audioPlaying();
	}
	/**
	*
	*/
	pause() {
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
		this.setState({
			canPlay: true
		});
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
	onTimeUpdate(currentPodcastPlaying,event) {
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
		if (this.state.playing) {
			this.props.audioController.play();
		}
	}
	/**
	*
	*/
	onEnded() {
		Events.emit('OnEpisodeEnded',{
			episodeIndex: this.props.activeEpisode.episodeIndex
		});
		
		this.props.episodeFinished(this.props.activePodcast,this.props.activeEpisode);
		
		this.onNextEpisode();
	}
	/**
	*
	*/
	onNextEpisode() {
		var percentage = (100 * this.props.audioController.getCurrentTime()) / this.props.audioController.getDuration();
		
		if (percentage > 75) {
			this.props.episodeFinished(this.props.activePodcast,this.props.activeEpisode);
		}
		
		var nextEpisodeIndex = this.props.activeEpisode.episodeIndex + 1;
		
		this.changeEpisode(nextEpisodeIndex);
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
	changeEpisode(episodeIndex) {
		console.log('changeEpisode: ' + episodeIndex);
		var episode = this.props.activePodcast.episodes[episodeIndex];

		if (episode) {
			this.props.playEpisode(this.props.activePodcast,episode);
			
			Events.emit('OnEpisodePlaying',{
				playing: this.state.playing,
				podcast: this.props.activePodcast,
				episode: episode,
				episodeIndex: episodeIndex,
				episodeList: this.props.activePodcast.episodeList
			});
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
		var PlayerUI = this.props.UI;
		
		var hasEpisode = this.props.activePodcast ? true : false;
		
		var title = sanitizeHtml(this.props.activeEpisode ? this.props.activeEpisode.title : 'No episode selected yet.',{
			allowedTags: []
		});

		if (hasEpisode) {
			return (
				<PlayerUI
					audioController={this.props.audioController}
					onProgressSliderChange={this.onProgressSliderChange}
					title={title}
					progress={this.state.progress}
					duration={this.state.duration}
					onCanPlay={this.onCanPlay}
					onLoadedMetadata={this.onLoadedMetadata}
					
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

					canPlay={this.state.canPlay}
					playing={this.state.playing}
					volume={this.state.volume}
					onTimeUpdate={this.onTimeUpdate}
				/>
			);
		}
		else {
			return false;
		}
	}
}

const ConnectedPlayer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Player);

export default ConnectedPlayer;