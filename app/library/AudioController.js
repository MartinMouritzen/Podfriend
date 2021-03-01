class AudioController {
	
	STATE_LOADING = 1;
	STATE_PLAYING = 2;
	STATE_PAUSED = 3;

	sleepTimerStartedTimeStamp = false;
	sleepTimerSeconds = false;
	sleepTimerId = false;

	playingTrack = false;
	
	/**
	*
	*/
	constructor() {
		this.audioElement = false;
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
	setSleepTimer(seconds) {
		clearTimeout(this.sleepTimerId);
		this.sleepTimerStartedTimeStamp = new Date();
		this.sleepTimerSeconds = seconds;
		this.sleepTimerId = setTimeout(() => {
			this.sleepTimerSeconds = false;
			this.sleepTimerStartedTimeStamp = false;
			this.player.pause();
		},(this.sleepTimerSeconds * 1000));
	}
	cancelSleepTimer() {
		this.sleepTimerStartedTimeStamp = false;
		this.sleepTimerSeconds = false;
		clearTimeout(this.sleepTimerId);
	}
	/**
	*
	*/
	getRemainingSleepTimerSeconds() {
		var timeStarted = this.sleepTimerStartedTimeStamp;
		if (timeStarted) {
			var dif = (new Date().getTime() - timeStarted.getTime()) / 1000;
			return this.sleepTimerSeconds - dif
		}
		return timeStarted;
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
	retry() {
		var currentTime = this.getCurrentTime();
		this.load();
		this.setCurrentTime(currentTime);
		this.play();
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
	forward() {
		if (this.player) {
			this.player.onForward();
		}
	}
	rewind() {
		if (this.player) {
			this.player.onBackward();
		}
	}
	nextTrack() {
		if (this.player) {
			this.player.onNextEpisode();
		}
	}
	previousTrack() {
		if (this.player) {
			this.player.onPrevEpisode();
		}
	}
	setEpisode(podcast,episode) {
		const coverPath = 'https://podcastcovers.podfriend.com/' + podcast.path + '/';

		var sizes = [20,120,400,600,800];

		var coverSizes = [];

		for(var i=0;i<sizes.length;i++) {
			coverSizes.push({
				src: (coverPath + sizes[i] + 'x' + sizes[i] + '/' + encodeURI(episode.image ? episode.image : podcast.image)),
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
export default AudioController;