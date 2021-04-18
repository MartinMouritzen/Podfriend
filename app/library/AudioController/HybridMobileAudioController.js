import AudioController from 'podfriend-approot/library/AudioController/AudioController.js';

import { MusicControls } from '@ionic-native/music-controls';

class WebAudioController extends AudioController {
	useBrowserAudioElement = true;

	/**
	*
	*/
	constructor() {
		super();
		this.musicControls = MusicControls;
		this.audioElement = false;
		this.coverServerURL = 'https://podcastcovers.podfriend.com/';
	}
	startService() {
		
	}
	init() {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = "none";

			try { navigator.mediaSession.setActionHandler('play',() => { this.play(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('pause',() => { this.pause(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('stop',() => { this.pause(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('seekbackward',() => { this.rewind(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('seekforward',() => { this.forward(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('seekto',() => { this.setCurrentTime(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('previoustrack',() => { this.previousTrack(); }); } catch (exception) { console.log('media exception: ' + exception); }
			try { navigator.mediaSession.setActionHandler('nexttrack',() => { this.nextTrack(); }); } catch (exception) { console.log('media exception: ' + exception); }
		}
	}
	/**
	*
	*/
	setAudioElement(audioElement) {
		this.audioElement = audioElement;
	}
	/**
	*
	*/
	setCoverImage(src) {
		var trackClone = {...this.playingTrack};
		trackClone.artwork = [{
			src: src,
			sizes: '200x200',
			type: 'image/png'
		}];

		// console.log('setting cover image');
		// console.log(trackClone);

		navigator.mediaSession.metadata = new MediaMetadata(trackClone);
	}
	/**
	*
	*/
	restoreCoverImage() {
		console.log('restoring cover image');
		navigator.mediaSession.metadata = new MediaMetadata(this.playingTrack);
	}
	/**
	*
	*/
	setPlaybackRate(playbackRate) {
		if (this.audioElement && this.audioElement.current) {
			if (!playbackRate || Number.isNaN(playbackRate)) {
				playbackRate = 1;
			}

			this.audioElement.current.playbackRate = playbackRate;
		}
	}
	/**
	*
	*/
	setCurrentTime(newTime) {
		if (this.audioElement && this.audioElement.current) {
			if (isNaN(newTime)) {
				return Promise.resolve(true);
			}
			this.audioElement.current.currentTime = newTime;
		}
		return Promise.resolve(true);
	}
	/**
	*
	*/
	getCurrentTime() {
		return this.audioElement.current.currentTime;
	}
	/**
	*
	*/
	getDuration() {
		return this.audioElement.current.duration;
	}
	pause() {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = "paused";
		}
		this.musicControls.updateIsPlaying(false);
		this.audioElement.current.pause();
		return Promise.resolve(true);
	}
	load() {
		this.audioElement.current.load();
		return Promise.resolve(true);
	}
	play() {
		var returnValue = this.audioElement.current.play()
		if (returnValue.then) {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.playbackState = "playing";
			}
			this.musicControls.updateIsPlaying(true);
			return returnValue.then;
		}
		return Promise.resolve(true);
	}
	setVolume(newVolume) {
		this.audioComponent.current.volume = newVolume;
	}
	getVolume() {
		return this.audioComponent.current.volume;
	}
	/**
	* 
	*/
	__createMediaControls(podcast,episode) {
		var coverUrl = this.coverServerURL + podcast.path + '/' + '600x600/' + encodeURI(episode.image ? episode.image : podcast.image);

		this.musicControls.create({
			track: episode.title,
			artist: podcast.author,
			album: podcast.name,
			cover: coverUrl,
			isPlaying: this.player.props.isPlaying,
			dismissable: true,
			hasPrev: true,
			hasNext: true,
			hasClose: true,
			// iOS only, optional
			duration: this.player.state.duration,
			elapsed: this.player.state.progress,
			hasSkipForward: true, // true value overrides hasNext.
			hasSkipBackward: true, // true value overrides hasPrev.
			skipForwardInterval : 15,
			skipBackwardInterval : 15,
			hasScrubbing : true,
			ticker: 'Now playing ' + episode.title,
		}, () => {
			console.log('MusicControls success!');
		},() => {
			console.log('MusicControls error!');
		});

		this.musicControls
		.subscribe()
		.subscribe((action) => {
			const message = JSON.parse(action).message;
			
			switch(message) {
				case 'music-controls-next':
					console.log('music-controls-next');
					this.player.onNextEpisode();
					break;
				case 'music-controls-previous':
					console.log('music-controls-previous');
					this.player.onPrevEpisode();
					break;
				case 'music-controls-pause':
					console.log('music-controls-pause');
					this.player.pause();
					break;
				case 'music-controls-play':
					console.log('music-controls-play');
					this.player.play();
					break;
				case 'music-controls-destroy':
					console.log('music-controls-destroy - the user probably swiped it away!');
					this.player.pause();
					break;
		
				// External controls (iOS only)
				case 'music-controls-toggle-play-pause' :
					console.log('music-controls-toggle-play-pause');
					break;
				case 'music-controls-seek-to':
					console.log('music-controls-seek-to');
					const seekToInSeconds = JSON.parse(action).position;

					this.player.setCurrentTime(seekToInSeconds * 1000);

					this.musicControls.updateElapsed({
						elapsed: seekToInSeconds,
						isPlaying: true
					});
					break;
				case 'music-controls-skip-forward':
					console.log('music-controls-skip-forward');
					this.player.onForward();
					break;
				case 'music-controls-skip-backward':
					console.log('music-controls-skip-backward');
					this.player.onBackward();
					break;
				// Headset events (Android only)
				// All media button events are listed below
				case 'music-controls-media-button':
					console.log('music-controls-media-button');
					// Do something
					break;
				case 'music-controls-headset-unplugged':
					console.log('music-controls-headset-unplugged');
					// Do something
					break;
				case 'music-controls-headset-plugged':
					console.log('music-controls-headset-plugged');
					// Do something
					break;
				default:
					break;
			}
		});
		this.musicControls.listen();
	}
	setEpisode(podcast,episode) {
		var sizes = [20,120,400,600,800];

		var coverSizes = [];

		for(var i=0;i<sizes.length;i++) {
			coverSizes.push({
				src: (this.coverServerURL + podcast.path + '/' + sizes[i] + 'x' + sizes[i] + '/' + encodeURI(episode.image ? episode.image : podcast.image)),
				sizes: sizes[i] + 'x' + sizes[i],
				type: 'image/jpg'
			});
		}

		this.playingTrack = {
			title: episode.title,
			artist: podcast.author,
			album: podcast.name,
			artwork: coverSizes
		};

		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata(this.playingTrack);
		}

		this.__createMediaControls(podcast,episode);

		return Promise.resolve(true);
		/*
		return new Promise(() => {
			return true;
		});
		*/
	}
	destroy() {
		
	}
}
export default WebAudioController;