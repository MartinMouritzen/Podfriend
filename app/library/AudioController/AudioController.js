class AudioController {
	sleepTimerStartedTimeStamp = false;
	sleepTimerSeconds = false;
	sleepTimerId = false;

	playingTrack = false;
	
	startService() {
		
	}
	init() {
		
	}
	/**
	*
	*/
	setAudioElement(audioElement) {
		
	}
	/**
	*
	*/
	setCoverImage(src) {
		
	}
	/**
	*
	*/
	restoreCoverImage() {
		
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
		
	}
	/**
	*
	*/
	setCurrentTime(newTime) {
		
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
		
	}
	/**
	*
	*/
	getDuration() {
		
	}
	pause() {
		
	}
	load() {
		
	}
	play() {
		
	}
	setVolume(newVolume) {
		
	}
	getVolume() {
		
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
		
	}
	destroy() {
		
	}
}
export default AudioController;