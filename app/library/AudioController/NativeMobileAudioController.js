// We need to see if https://github.com/Rolamix/cordova-plugin-playlist is a better alternative
import { Media } from '@ionic-native/media';

import { MusicControls } from '@ionic-native/music-controls';

import AudioController from 'podfriend-approot/library/AudioController/AudioController.js';

class NativeMobileAudioController extends AudioController {
	useBrowserAudioElement = false;

	STATUS_NONE = 0;
	STATUS_STARTING = 1;
	STATUS_RUNNING = 2;
	STATUS_PAUSED = 3;
	STATUS_STOPPED = 4;

	ERROR_ABORTED = 1;
	ERROR_NETWORK = 2;
	ERROR_DECODE = 3;
	ERROR_SUPPORTED = 4;

	status = 0;
	error = false;

	constructor() {
		super();
		this.musicControls = MusicControls;
		console.log('NativeMobileAudioController');


		this.__onAudioStatusChanged = this.__onAudioStatusChanged.bind(this);
	}
	startService() {
		console.log('NativeMobileAudioController:startService');
	}
	init() {
		console.log('NativeMobileAudioController:init');
	}
	/**
	*
	*/
	setAudioElement(audioElement) {
		console.log('NativeMobileAudioController:setAudioElement');
	}
	/**
	*
	*/
	setCoverImage(src) {
		console.log('NativeMobileAudioController:setCoverImage');
	}
	/**
	*
	*/
	restoreCoverImage() {
		console.log('NativeMobileAudioController:restoreCoverImage');
	}
	/**
	*
	*/
	setPlaybackRate(playbackRate) {
		console.log('NativeMobileAudioController:setPlaybackRate');
	}
	/**
	*
	*/
	setCurrentTime(newTime) {
		if (!this.media) { return; }
		this.media.seekTo(newTime);
		console.log('NativeMobileAudioController:setCurrentTime');
		return Promise.resolve(true);
	}
	/**
	*
	*/
	getCurrentTime() {
		if (!this.media) { return; }
		this.media.getCurrentPosition();
		console.log('NativeMobileAudioController:getCurrentTime');
	}
	/**
	*
	*/
	getDuration() {
		if (!this.media) { return; }
		this.media.getDuration();
		console.log('NativeMobileAudioController:getDuration');
	}
	pause() {
		if (!this.media) { return; }
		this.media.pause();
		console.log('NativeMobileAudioController:pause');
		this.musicControls.updateIsPlaying(false);
		return Promise.resolve(true);
	}
	load() {
		console.log('NativeMobileAudioController:load');
		return Promise.resolve(true);
	}
	play() {
		if (!this.media) { return; }
		console.log('NativeMobileAudioController:play');

		this.onBuffering();

		this.media.play({
			playAudioWhenScreenIsLocked : true
		});
		this.musicControls.updateIsPlaying(true);
	}
	setVolume(newVolume) {
		if (!this.media) { return; }
		this.media.setVolume(newVolume);
		console.log('NativeMobileAudioController:setVolume');
	}
	getVolume() {
		console.log('NativeMobileAudioController:getVolume');
	}
	setEpisode(podcast,episode) {
		console.log('NativeMobileAudioController:setEpisode');
		const coverPath = 'https://podcastcovers.podfriend.com/' + podcast.path + '/';

		/*
		var sizes = [20,120,400,600,800];

		var coverSizes = [];

		for(var i=0;i<sizes.length;i++) {
			coverSizes.push({
				src: (coverPath + sizes[i] + 'x' + sizes[i] + '/' + encodeURI(episode.image ? episode.image : podcast.image)),
				sizes: sizes[i] + 'x' + sizes[i],
				type: 'image/jpg'
			});
		}
		*/

		var coverUrl = coverPath + '600x600/' + encodeURI(episode.image ? episode.image : podcast.image);

		this.playingTrack = {
			title: episode.title,
			artist: podcast.author,
			album: podcast.name,
			artwork: coverUrl
		};

		if (this.media) {
			this.media.release();
		}

		if (this.onCanPlay) {
			// Workaround
			this.onCanPlay();
			// this.onBuffering();
		}

		this.media = Media.create(episode.url);

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
			duration: this.getDuration(),
			elapsed: this.getCurrentTime(),
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
					this.nextTrack();
					break;
				case 'music-controls-previous':
					console.log('music-controls-previous');
					this.previousTrack();
					break;
				case 'music-controls-pause':
					console.log('music-controls-pause');
					this.pause();
					break;
				case 'music-controls-play':
					console.log('music-controls-play');
					this.play();
					break;
				case 'music-controls-destroy':
					console.log('music-controls-destroy - the user probably swiped it away!');
					break;
		
				// External controls (iOS only)
				case 'music-controls-toggle-play-pause' :
					console.log('music-controls-toggle-play-pause');
					// if (this.media
					break;
				case 'music-controls-seek-to':
					console.log('music-controls-seek-to');
					const seekToInSeconds = JSON.parse(action).position;
					this.musicControls.updateElapsed({
						elapsed: seekToInSeconds,
						isPlaying: true
					});
					break;
				case 'music-controls-skip-forward':
					console.log('music-controls-skip-forward');
					this.forward();
					break;
				case 'music-controls-skip-backward':
					console.log('music-controls-skip-backward');
					this.rewind();
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

		this.media.onStatusUpdate.subscribe(this.__onAudioStatusChanged);
		this.media.onSuccess.subscribe(() => console.log('NativeMobileAudioController success!'));
		this.media.onError.subscribe((error) => {
			console.log('Error in NativeMobileAudioController: ');
			console.log(error);
		});

		return Promise.resolve(true);
	}
	/**
	*
	*/
	__onAudioStatusChanged(newStatus) {
		if (newStatus === this.STATUS_NONE) {
			console.log('STATUS_NONE');
			if (this.onBuffering) {
				this.onBuffering();
			}
		}
		else if (newStatus === this.STATUS_STARTING) {
			console.log('STATUS_STARTING');
			if (this.onBuffering) {
				this.onBuffering();
			}
		}
		else if (newStatus === this.STATUS_RUNNING) {
			console.log('STATUS_RUNNING');
			if (this.onCanPlay) {
				this.onCanPlay();
			}
		}
		else if (newStatus === this.STATUS_PAUSED) {
			console.log('STATUS_PAUSED');
			if (this.onCanPlay) {
				this.onCanPlay();
			}
		}
		else if (newStatus === this.STATUS_STOPPED) {
			console.log('STATUS_STOPPED');
			if (this.onCanPlay) {
				this.onCanPlay();
			}
		}
		console.log('Audio status changed: ' + newStatus);
		this.status = newStatus;
	}
	destroy() {
		console.log('NativeMobileAudioController:destroy');
	}
}
export default NativeMobileAudioController;