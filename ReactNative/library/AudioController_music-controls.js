import Events from 'podfriend-approot/library/Events.js';

import MusicControl from 'react-native-music-control';

import SoundPlayer from 'react-native-sound-player'

class AudioController {
	onCanPlay = false;
	onEnded = false;
	
	STATE_LOADING = 1;
	STATE_PLAYING = 2;
	STATE_PAUSED = 3;
	
	constructor() {
		console.log('AudioController constructor - consider changing to react-native-music-control');
		console.log('Read https://medium.com/@emmettharper/the-state-of-audio-libraries-in-react-native-7e542f57b3b4');
		console.log('and google some more');
	}
	startService() {
		// var PlayerService = require('./PlayerService.js');

		// The player is ready to be used
		// TrackPlayer.registerPlaybackService(() => PlayerService(this));

	}
	init() {
		// Basic Controls
		
		console.log('init audiocontroller');
		this.pressedStop = 0;
		
		this.data = {
			position: 0,
			bufferedPosition: 0,
			duration: 0,
			state: 'none',
			wasPlayingBeforeStop: false
		};
		
		MusicControl.on('play', ()=> {
			console.log('play pressed');
		});
	}
	/**
	 * Updates the progress state
	 * @private
	 */
	async _updateProgress() {

	}
	setCurrentTime(newTime) {
		return Promise.resolve();
	}
	getCurrentTime() {
		return this.data.position;
	}
	getDuration() {
		// return await TrackPlayer.getDuration() * 1000;
		return this.data.duration;
	}
	pause() {
		console.log('pause');
		SoundPlayer.pause();
		return Promise.resolve();
	}
	load() {
		return Promise.resolve();
	}
	play() {
		console.log('play');
		SoundPlayer.play();
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
		MusicControl.enableControl('closeNotification', true, {when: 'always'})
		
		MusicControl.setNowPlaying({
		  title: episode.title,
		  artwork: podcast.artworkUrl600,
		  artist: podcast.author,
		  album: podcast.name,
		  genre: 'Podcast',
		  duration: parseInt(episode.duration),
		  description: episode.description, // Android Only
		  color: 0xFF23AA, // Android Only - Notification Color
		  colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
		  date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
		  rating: 84 // Android Only (Boolean or Number depending on the type)
		});

		console.log('loadSoundFile');
		try {
			SoundPlayer.playSoundFile(episode.url);
		}
		catch (e) {
			console.log('cannot play the song file', e)
		}

	MusicControl.enableControl('previousTrack', true)

	MusicControl.enableControl('skipBackward', true)
	
		MusicControl.enableControl('play', true)
		MusicControl.enableControl('pause', true)

	MusicControl.enableControl('skipForward', true)

		MusicControl.enableControl('nextTrack', true)
		
		MusicControl.enableControl('changePlaybackPosition', true);
		MusicControl.enableControl('seek', true)
		
		MusicControl.on('closeNotification', ()=> {
			console.log('Goodbye!');
		});
		
		MusicControl.enableControl('closeNotification', true, {when: 'always'})

		MusicControl.enableBackgroundMode(true);

		return Promise.resolve();

		// notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon

		/*
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
		*/
	}
	destroy() {
		console.log('destroying trackplayer');
		clearInterval(this._timer);

	}
}
export default AudioController;