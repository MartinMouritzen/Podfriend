// We need to see if https://github.com/Rolamix/cordova-plugin-playlist is a better alternative
// import { Media } from '@ionic-native/media';

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

	__audioHasLoaded = false;
	__audioIsLoading = false;

	status = 0;
	error = false;

	loadPromise = false;
	__loadCheckId = false;

	currentPosition = 0;

	constructor() {
		super();
		this.musicControls = MusicControls;

		console.log('NativeMobileAudioController');

		this.__onAudioStatusChanged = this.__onAudioStatusChanged.bind(this);
		this.__createMusicControls = this.__createMusicControls.bind(this);
		this.__refreshCurrentPosition = this.__refreshCurrentPosition.bind(this);
		this.__setInternalCurrentPosition = this.__setInternalCurrentPosition.bind(this);
		this.load = this.load.bind(this);
		this.play = this.play.bind(this);
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
	 * Updates the currentPosition state
	 * @private
	 */
	__refreshCurrentPosition() {
		// return new Promise((resolve,reject) => {
			this.media.getCurrentPosition((currentPosition) => {
				//console.log('hasLoaded: ' + (this.hasLoaded ? 'YES' : 'NO') + ', isLoading: ' + (this.isLoading() ? 'YES' : 'NO') + ', _updateCurrentPosition: ' + currentPosition);
				if (currentPosition != this.currentPosition) {
					console.log('Updating Current position: ' + currentPosition);

					this.__setInternalCurrentPosition(currentPosition)
				}
			},(error) => {
				console.log('Error while updating the current position');
				console.log(error);
			});

		// });
	}
	__setInternalCurrentPosition(timeInSeconds) {
		this.currentPosition = timeInSeconds;
		this.player.onTimeUpdate();
	}
	/**
	*
	*/
	setCurrentTime(timeInSeconds) {
		if (!this.media || !this.hasLoaded()) {
			return Promise.resolve(true);
		}
		if (timeInSeconds < 0) {
			timeInSeconds = 0;
		}
		console.log('setCurrentTime: ' + timeInSeconds);

		this.media.seekTo(timeInSeconds * 1000);

		this.__setInternalCurrentPosition(timeInSeconds)

		// console.log('NativeMobileAudioController:setCurrentTime: ');
		// console.log(timeInSeconds);

		this.musicControls.updateElapsed({
			elapsed: timeInSeconds,
			isPlaying: this.player.props.isPlaying
		});
		return Promise.resolve(true);
	}
	/**
	*
	*/
	getCurrentTime() {
		if (!this.media) { return false; }
		console.log('NativeMobileAudioController:getCurrentTime: ' + this.currentPosition);
		// return this.media.getCurrentPosition();
		return this.currentPosition < 0 ? 0 : this.currentPosition;
	}
	/**
	*
	*/
	getDuration() {
		if (!this.media || !this.hasLoaded()) { return false; }
		var duration = this.media.getDuration();
		console.log('NativeMobileAudioController:getDuration: ' + duration + ', ' + this.media.duration);
		if (duration < 0) {
			return 0;
		}
		return duration;
	}
	pause() {
		if (!this.media || !this.hasLoaded()) { return Promise.resolve(true); }
		this.media.pause();
		clearInterval(this._currentPositionTimerId);
		console.log('NativeMobileAudioController:pause');
		this.musicControls.updateIsPlaying(false);
		return Promise.resolve(true);
	}
	load() {
		if (this.hasLoaded()) {
			return Promise.resolve();
		}
		else {
			console.log('NativeAudioController: Creating a new load() promise');

			if (this.loadPromise === false) {
				this.loadPromise = new Promise((resolve,reject) => {
					this.__loadCheckId = setInterval(() => {
						const duration = this.media.getDuration();
						console.log('Load-Check: 1!!!!!');
						if (duration !== -1 && duration !== 0) {
							console.log('Load-Done 1!!!!!');

							clearInterval(this.__loadCheckId);
							this.__loadCheckId = false;

							return resolve(true);
						}
					},300);
				});
			}
			return this.loadPromise;
		}
	}
	play() {
		if (!this.media || !this.hasLoaded()) { console.log('test123: ' + this.hasLoaded() + ', ' + this.media); return; }
		console.log('NativeMobileAudioController:play');

		this.media.play({
			playAudioWhenScreenIsLocked : true
		});
		clearInterval(this._currentPositionTimerId);
		this._currentPositionTimerId = setInterval(this.__refreshCurrentPosition.bind(this), 1000);

		this.musicControls.updateIsPlaying(true);
	}
	setVolume(newVolume) {
		if (!this.media || !this.hasLoaded()) { return; }
		this.media.setVolume(newVolume);
		console.log('NativeMobileAudioController:setVolume');
	}
	getVolume() {
		console.log('NativeMobileAudioController:getVolume');
	}
	hasLoaded() {
		return this.__audioHasLoaded;
	}
	isLoading() {
		return this.__audioIsLoading;
	}
	setEpisode(podcast,episode) {
		console.log('NativeMobileAudioController:setEpisode');

		return new Promise((resolve,reject) => {
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
				console.log('media release?');
				this.media.release();
			}
			// If we load a new media object, then stop loading any previous ones
			clearInterval(this.__loadCheckId);
			this.__loadCheckId = false;
			this.loadPromise = false;

			this.currentPosition = 0; // should this be false? (as well as the original value in the class)

			this.onBuffering();

			console.log('Creating a new Media object');

			this.__audioIsLoading = true;
			this.__audioHasLoaded = false;

			// this.media = Media.create(episode.url);
			this.media = new Media(episode.url, (success) => {
				return resolve(true);
			},(error) => {
				return reject(error);
			},(newStatus) => {
				console.log('AYAYAYAY: ' + newStatus);
				console.log('media duration after status update: ' + this.media.getDuration());
				/*
				this.__audioIsLoading = false;
				this.__audioHasLoaded = true;
				*/
			});
			this.load()
			.then(() => {
				console.log('Finished loading! Wuuuuiii!!!')
				this.__audioIsLoading = false;
				this.__audioHasLoaded = true;

				this.onCanPlay();
				console.log('before controls');
				this.__createMusicControls(podcast,episode);
				console.log('after controls');

				if (this.player.props.shouldPlay) {
					this.play();
				}
			});

			// console.log('media duration before play: ' + this.media.getDuration());

			/*
			setInterval(() => {
				var duration = this.media.getDuration();
				console.log('Duration test: ' + duration);
			}, 1000);
			*/

			// this.media.play();

			// console.log('media duration after play: ' + this.media.getDuration());

			// this.media.onStatusUpdate.subscribe(this.__onAudioStatusChanged);

			/*
			console.log('STATUSUPDATE METHODS');
			console.log(typeof this.media._objectInstance);
			console.log('123');
			console.log(typeof this.media.onStatusUpdate);
			console.log('ABC');
			console.log(typeof this.media.onStatusUpdate.subscribe);
			console.log('DEF');
	*/
		});
	}
	__createMusicControls() {
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
					break;
		
				// External controls (iOS only)
				case 'music-controls-toggle-play-pause' :
					console.log('music-controls-toggle-play-pause');
					this.player.playOrPause();
					break;
				case 'music-controls-seek-to':
					console.log('music-controls-seek-to');
					const seekToInSeconds = JSON.parse(action).position;

					this.player.setCurrentTime(seekToInSeconds);
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
	/**
	*
	*/
	__onAudioStatusChanged(newStatus) {
		console.log('__onAudioStatusChanged: ' + newStatus);
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