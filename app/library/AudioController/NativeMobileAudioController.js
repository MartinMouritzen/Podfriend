import { Media, MediaObject } from '@ionic-native/media';

import { MusicControls } from '@ionic-native/music-controls';

import AudioController from 'podfriend-approot/library/AudioController/AudioController.js';

/*
const onDeviceReady = () => {
	console.log('DEVICE READY');
	console.log(Media);
};
console.log(Media);

var media = Media.create('https://hwcdn.libsyn.com/p/6/0/e/60e240a1beba94de/07_The_Iceberg.mp3?c_id=63603521&cs_id=63603521&destination_id=1171880&expiration=1618437398&hwt=f44cfade617bc2defee8b27b237fd44d');
console.log(media);

setTimeout(() => {
	console.log('after 5 secs');
	media.play();
	console.log('after media play');
},5000);
 console.log('after media play init');

 media.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

	media.onStatus = (id, msgType, value) => {
		console.log('media onStatus!!!');
		console.log(id);
		console.log(msgType);
		console.log(value);
	}

 media.onSuccess.subscribe(() => console.log('Action is successful'));
 
 media.onError.subscribe(error => console.log('Error!', error));


document.addEventListener("deviceready", onDeviceReady, false);

console.log('platforms');
*/
class NativeMobileAudioController extends AudioController {
	constructor() {
		super();
		this.musicControls = MusicControls;
		console.log('NativeMobileAudioController');
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
		return Promise.resolve(true);
	}
	load() {
		console.log('NativeMobileAudioController:load');
		return Promise.resolve(true);
	}
	play() {
		if (!this.media) { return; }
		console.log('NativeMobileAudioController:play');
		this.media.play({
			playAudioWhenScreenIsLocked : true
		});

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

		this.media = Media.create(episode.url);

		this.musicControls.create({
			track			 : episode.title,		// optional, default : ''
			artist			: podcast.author,						// optional, default : ''
			album			 : podcast.name,		 // optional, default: ''
			cover			 : coverUrl,		// optional, default : nothing
			// cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
			//			 or a remote url ('http://...', 'https://...', 'ftp://...')
			isPlaying	 : true,							// optional, default : true
			dismissable : true,							// optional, default : false

			// hide previous/next/close buttons:
			hasPrev	 : true,		// show previous button, optional, default: true
			hasNext	 : true,		// show next button, optional, default: true
			hasClose	: true,		// show close button, optional, default: false
			// iOS only, optional
			duration : this.getDuration(), // optional, default: 0
			elapsed : this.getCurrentTime(), // optional, default: 0
			hasSkipForward : true, //optional, default: false. true value overrides hasNext.
			hasSkipBackward : true, //optional, default: false. true value overrides hasPrev.
			skipForwardInterval : 15, //optional. default: 0.
			skipBackwardInterval : 15, //optional. default: 0.
			hasScrubbing : false, //optional. default to false. Enable scrubbing from control center progress bar 

			// Android only, optional
			// text displayed in the status bar when the notification (and the ticker) are updated
			ticker: 'Now playing ' + episode.title,
		}, () => {
			console.log('MusicControls success!');
		},() => {
			console.log('MusicControls error!');
		});

		this.musicControls.subscribe().subscribe((action) => {
			const message = JSON.parse(action).message;
			
			switch(message) {
				case 'music-controls-next':
					this.nextTrack();
					break;
				case 'music-controls-previous':
					this.prevTrack();
					break;
				case 'music-controls-pause':
					this.pause();
					break;
				case 'music-controls-play':
					// Do something
					break;
				case 'music-controls-destroy':
					// Do something
					break;
		
				// External controls (iOS only)
				case 'music-controls-toggle-play-pause' :
						// Do something
						break;
				case 'music-controls-seek-to':
					const seekToInSeconds = JSON.parse(action).position;
					this.musicControls.updateElapsed({
						elapsed: seekToInSeconds,
						isPlaying: true
					});
					// Do something
					break;
					case 'music-controls-skip-forward':
					// Do something
					break;
				case 'music-controls-skip-backward':
					// Do something
					break;
		
				// Headset events (Android only)
				// All media button events are listed below
				case 'music-controls-media-button' :
					// Do something
					break;
				case 'music-controls-headset-unplugged':
					// Do something
					break;
				case 'music-controls-headset-plugged':
					// Do something
					break;
				default:
					break;
			}
		});
		 
		this.musicControls.listen(); // activates the observable above
		 
		this.musicControls.updateIsPlaying(true);

		return Promise.resolve(true);
	}
	destroy() {
		console.log('NativeMobileAudioController:destroy');
	}
}
export default NativeMobileAudioController;