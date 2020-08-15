import TrackPlayer from 'react-native-track-player';

import Events from 'podfriend-approot/library/Events.js';

class AudioController {
	onCanPlay = false;
	onEnded = false;
	
	STATE_LOADING = 1;
	STATE_PLAYING = 2;
	STATE_PAUSED = 3;
	
	constructor() {
		console.log('AudioController constructor - consider changing to eact-native-music-control');
		console.log('Read https://medium.com/@emmettharper/the-state-of-audio-libraries-in-react-native-7e542f57b3b4');
		console.log('and google some more');
	}
	startService() {
		var PlayerService = require('./PlayerService.js');

		// The player is ready to be used
		TrackPlayer.registerPlaybackService(() => PlayerService(this));
	}
	init() {
		console.log('init audiocontroller');
		this.pressedStop = 0;
		
		this.data = {
			position: 0,
			bufferedPosition: 0,
			duration: 0,
			state: TrackPlayer.STATE_NONE,
			wasPlayingBeforeStop: false
		};
		
		/*
		TrackPlayer.addEventListener('remote-play', async () => {
			console.log('remote-play');
			this.props.audioController.player.play();
		});
		TrackPlayer.addEventListener('remote-pause', async () => {
			console.log('remote-pause');
			this.props.audioController.player.pause();
		});
		TrackPlayer.addEventListener('remote-stop', async () => {
			console.log('remote-stop');
			
			if (this.pressedStop > 3) {
				TrackPlayer.stop();
				TrackPlayer.destroy();
			}
			this.pressedStop = this.pressedStop + 1;
			TrackPlayer.pause();
		});
		TrackPlayer.addEventListener('remote-jump-backward', async () => {
			TrackPlayer.seekTo(await TrackPlayer.getPosition() - 15);
		});
		TrackPlayer.addEventListener('remote-jump-forward', async () => {
			TrackPlayer.seekTo(await TrackPlayer.getPosition() + 15);
		});
		TrackPlayer.addEventListener('remote-next', async () => {
			await TrackPlayer.skipToNext();
		});
		TrackPlayer.addEventListener('remote-previous', async () => {
			await TrackPlayer.skipToPrevious();
		});
		*/
		
		TrackPlayer.setupPlayer()
		.then(() => {
			TrackPlayer.updateOptions({
				stopWithApp: true,
				waitForBuffer: true,
				ratingType: TrackPlayer.RATING_HEART,
				capabilities: [
					TrackPlayer.CAPABILITY_PLAY,
					TrackPlayer.CAPABILITY_PAUSE,
					// TrackPlayer.CAPABILITY_STOP,
					TrackPlayer.CAPABILITY_SEEK_TO,
					TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
					TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
					TrackPlayer.CAPABILITY_SET_RATING,
					TrackPlayer.CAPABILITY_JUMP_FORWARD,
					TrackPlayer.CAPABILITY_JUMP_BACKWARD
				],
				compactCapabilities: [
					TrackPlayer.CAPABILITY_PLAY,
					TrackPlayer.CAPABILITY_PAUSE,
					TrackPlayer.CAPABILITY_STOP,
					TrackPlayer.CAPABILITY_SEEK_TO,
					TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
					TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
					TrackPlayer.CAPABILITY_SET_RATING,
					TrackPlayer.CAPABILITY_JUMP_FORWARD,
					TrackPlayer.CAPABILITY_JUMP_BACKWARD
				]
			})
			.then(() => {
				this._timer = setInterval(this._updateProgress.bind(this), 1000);
				
				/*
				TrackPlayer.addEventListener('playback-metadata-received', (event) => {
					console.log('playback-metadata-received');
					console.log(event);
				});
				*/
				
				TrackPlayer.addEventListener('playback-queue-ended', ({track,position}) => {
					console.log('playback-queue-ended');
					if (this.data.wasPlayingBeforeStop) {
						console.log('Was playing - time to change track!');
						this.onEnded();
					}
				});
				
				TrackPlayer.addEventListener('playback-track-changed', ({track,position}) => {
					console.log('playback-track-changed');
					if (this.onEnded) {
						// this.onEnded();
					}
				});
				
				TrackPlayer.addEventListener('playback-error', ({code,message}) => {
					console.log('playback-error: ' + code);
					console.log(message);
				});
				
				TrackPlayer.addEventListener('playback-state', ({state}) => {
					// Update our cached state
					this.data.state = state;

					if (state === TrackPlayer.STATE_PLAYING) {
						this.data.wasPlayingBeforeStop = true
					}
					else if (state !== TrackPlayer.STATE_STOPPED && state !== TrackPlayer.STATE_BUFFERING) {
						this.data.wasPlayingBeforeStop = false
					}

					if (state === TrackPlayer.STATE_NONE) {
						console.log('TrackPlayer.STATE_NONE');
						if (this.onBuffering) {
							this.onBuffering();
						}
					}
					else if (state === TrackPlayer.STATE_READY) {
						console.log('TrackPlayer.STATE_READY');
						if (this.onCanPlay) {
							this.onCanPlay();
						}
					}
					else if (state === TrackPlayer.STATE_PLAYING) {
						console.log('TrackPlayer.STATE_PLAYING');
						if (this.onCanPlay) {
							this.onCanPlay();
						}
					}
					else if (state === TrackPlayer.STATE_PAUSED) {
						console.log('TrackPlayer.STATE_PAUSED');
						if (this.onCanPlay) {
							this.onCanPlay();
						}
					}
					else if (state === TrackPlayer.STATE_STOPPED) {
						console.log('TrackPlayer.STATE_STOPPED');
						if (this.onCanPlay) {
							this.onCanPlay();
						}
					}
					else if (state === TrackPlayer.STATE_BUFFERING) {
						console.log('TrackPlayer.STATE_BUFFERING');
						if (this.onBuffering) {
							this.onBuffering();
						}
					}
					else if (state === TrackPlayer.STATE_CONNECTING) {
						console.log('TrackPlayer.STATE_CONNECTING');
						if (this.onBuffering) {
							this.onBuffering();
						}
					}
				});
			});
		});
	}
	/**
	 * Updates the progress state
	 * @private
	 */
	async _updateProgress() {
		// TODO check for performance here
		// We can create a new native function to reduces these 3 native calls to only one, if needed
		try {
			const data = {
				position: await TrackPlayer.getPosition(),
				bufferedPosition: await TrackPlayer.getBufferedPosition(),
				duration: await TrackPlayer.getDuration(),
				state: this.data.state,
				wasPlayingBeforeStop: this.data.wasPlayingBeforeStop
			};
			this.data = data;
		}
		catch(e) {
			// The player is probably not initialized yet, we'll just ignore it
		}
	}
	setCurrentTime(newTime) {
		console.log('setCurrentTime: ' + newTime);
		return TrackPlayer.seekTo(newTime);
	}
	getCurrentTime() {
		return this.data.position;
	}
	getDuration() {
		// return await TrackPlayer.getDuration() * 1000;
		return this.data.duration;
	}
	pause() {
		return TrackPlayer.pause();
	}
	load() {
		return Promise.resolve();
	}
	play() {
		return TrackPlayer.play();
	}
	setVolume(newVolume) {
		
	}
	getVolume() {
		
	}
	forward() {
		
	}
	rewind() {
		
	}
	nextTrack() {
		
	}
	previousTrack() {
		
	}
	setEpisode(podcast,episode) {
		console.log(episode);
		return TrackPlayer.reset()
		.then(() => {
			var track = {
				id: 'unique track id', // Must be a string, required
				
				url: episode.url, // Load media from the network
				title: episode.title,
				artist: podcast.author,
				album: podcast.name,
				genre: 'Podcast',
				date: '2014-05-20T07:00:00+00:00', // RFC 3339
				duration: episode.duration,
				
				artwork: podcast.artworkUrl600
			};
			console.log('setting track');
			console.log(track);
			return TrackPlayer.add([track]).then(() => {

			})
			.catch((error) => {
				console.log('error happened adding track: ' + error);
			});
		});
	}
	destroy() {
		console.log('destroying trackplayer');
		clearInterval(this._timer);
		
		return TrackPlayer.stop()
		.then(() => {
			return TrackPlayer.destroy();
		});
	}
}
export default AudioController;