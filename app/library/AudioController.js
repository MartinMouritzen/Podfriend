class AudioController {
	
	STATE_LOADING = 1;
	STATE_PLAYING = 2;
	STATE_PAUSED = 3;
	
	/**
	*
	*/
	constructor() {
		this.audioElement = false;
	}
	/**
	*
	*/
	setAudioElement(audioElement) {
		this.audioElement = audioElement;
	}
	setCurrentTime(newTime) {
		this.audioElement.current.currentTime = newTime;
		return Promise.resolve(true);
	}
	getCurrentTime() {
		return this.audioElement.current.currentTime;
	}
	getDuration() {
		return this.audioElement.current.duration;
	}
	pause() {
		this.audioElement.current.pause();
		return Promise.resolve(true);
	}
	load() {
		this.audioElement.current.load();
		return Promise.resolve(true);
	}
	play() {
		this.audioElement.current.play();
		return Promise.resolve(true);
	}
	setVolume(newVolume) {
		this.audioComponent.current.volume = newVolume;
	}
	getVolume() {
		return this.audioComponent.current.volume;
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