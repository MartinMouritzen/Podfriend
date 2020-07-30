const md5 = require('md5');

/**
*
*/
class ClientStorage {
	/**
	*
	*/
	constructor() {
		this.podcastStates = this.getPodcastStates();
	}
	getPodcastStates() {
		var podcastStates = JSON.parse(localStorage.getItem('podcastStates'));
		if (podcastStates) {
			return this.recreatePodcastStates(podcastStates);
		}
		return {};
	}
	recreatePodcastStates(podcasts) {
		for (var key in podcasts) {
			if (podcasts[key].lastUpdateCheck) {
				podcasts[key].lastUpdateCheck = new Date(Date.parse(podcasts[key].lastUpdateCheck));
			}
			if (podcasts[key] && podcasts[key].episodes) {
				for (var i=0;i<podcasts[key].episodes.length;i++) {
					podcasts[key].episodes[i].date = new Date(Date.parse(podcasts[key].episodes[i].date));
				}
			}
		}
		return podcasts;
	}
	savePodcastStates() {
		localStorage.setItem('podcastStates',JSON.stringify(this.podcastStates));
	}
	saveStateforPodcast(podcast,episodes) {
		var urlmd5 = md5(podcast.feedUrl);
		
		podcast.episodes = episodes;	
		
		this.podcastStates[urlmd5] = podcast;
		this.savePodcastStates();
	}
	updateStateforPodcast(podcast,episodes) {
		console.log('UPDATING');
	}
	getPodcastState(feedUrl) {
		if (!feedUrl) {
			return false;
		}
		var urlmd5 = md5(feedUrl);

		return this.podcastStates[urlmd5];
	}
	updateEpisodeListenedStatus(podcastInfo,milliseconds) {
	}
	updateEpisodeTime(feedUrl,episodeIndex,milliseconds) {
		var urlmd5 = md5(feedUrl);
		
		if (this.podcastStates[urlmd5].episodes[episodeIndex]) {
			this.podcastStates[urlmd5].episodes[episodeIndex].progress = milliseconds;
			this.savePodcastStates();
		}
	}
	updateCurrentTime(milliseconds) {
		localStorage.setItem('currentTrackTime',milliseconds);
	}
	getCurrentTime(milliseconds) {
		return localStorage.getItem('currentTrackTime');
	}
}
module.exports = ClientStorage;


/*
	getLastVisitedPodcasts() {
		var lastPodcasts = JSON.parse(localStorage.getItem('lastVisitedPodcasts'));
		if (!lastPodcasts) {
			return [];
		}
		return lastPodcasts;
	}
	saveLastVisitedPodcasts(podcasts) {
		localStorage.setItem('lastVisitedPodcasts',JSON.stringify(podcasts));
	}
	updateCurrentPlayingPodcast(playingInfo) {
		localStorage.setItem('currentPlayingPodcast',JSON.stringify(playingInfo));
	}
	getCurrentPlayingPodcast() {
		return JSON.parse(localStorage.getItem('currentPlayingPodcast'));
	}
	subscribeToPodcast(podcastInfo) {
		podcastInfo.dateSubscribed = new Date();
		
		this.subscribedPodcasts.push(podcastInfo);
		
		localStorage.setItem('subscribedPodcasts',JSON.stringify(this.subscribedPodcasts));
	}

	unsubscribeToPodcast(podcastInfo) {
		let index = this.subscribedPodcasts.length - 1;
		while (index >= 0) {
			if (this.subscribedPodcasts[index].feedUrl === podcastInfo.feedUrl) {
				this.subscribedPodcasts.splice(index,1);
			}
			index--;
		}
		localStorage.setItem('subscribedPodcasts',JSON.stringify(this.subscribedPodcasts));
	}

	getSubscribedPodcasts() {
		return JSON.parse(localStorage.getItem('subscribedPodcasts'));
	}
	checkPodcastStorageVersion() {
		var podcastVersion = localStorage.getItem('podcastVersion');
		if (!podcastVersion) {
			localStorage.clear();
			localStorage.setItem('podcastVersion',1);
		}
	}
	archiveSubscribedPodcast(podcastInfo) {
		let index = this.subscribedPodcasts.length - 1;
		while (index >= 0) {
			if (this.subscribedPodcasts[index].feedUrl === podcastInfo.feedUrl) {
				console.log(podcastInfo.feedUrl);
				this.subscribedPodcasts[index].archived = true;
			}
			index--;
		}
		localStorage.setItem('subscribedPodcasts',JSON.stringify(this.subscribedPodcasts));
	}
	unArchiveSubscribedPodcast(podcastInfo) {
		let index = this.subscribedPodcasts.length - 1;
		while (index >= 0) {
			if (this.subscribedPodcasts[index].feedUrl === podcastInfo.feedUrl) {
				this.subscribedPodcasts[index].archived = false;
			}
			index--;
		}
		localStorage.setItem('subscribedPodcasts',JSON.stringify(this.subscribedPodcasts));
	}
	getPodcastFromPath(path) {
		for (var key in this.subscribedPodcasts) {
			console.log(this.subscribedPodcasts);
			if (this.subscribedPodcasts[key].path == path) {
				return this.subscribedPodcasts[key];
			}
		}
		return false;
	}
*/