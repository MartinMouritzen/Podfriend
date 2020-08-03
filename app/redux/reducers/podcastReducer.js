import localForage from "localforage";

import {
	LOGIN_SHOW,
	LOGIN_HIDE,
	FETCH_USER_PROFILE,
	USER_LOGGED_IN,
	USER_NOT_LOGGED_IN,
	PLAY_EPISODE, // Should be EPISODE_PLAY
	EPISODE_TIME_UPDATED,
	EPISODE_FINISHED,
	PODCAST_LOADING,
	PODCAST_LOAD_ERROR,
	PODCAST_LOADED,
	PODCAST_SUBSCRIBED,
	PODCAST_UNSUBSCRIBED,
	PODCAST_SUBSCRIBED_SUCCESS,
	PODCAST_SUBSCRIBED_ERROR,
	PODCAST_ARCHIVED,
	PODCAST_UNARCHIVED,
	PODCAST_VIEW,
	PODCAST_SEARCHING,
	PODCAST_SEARCHED,
	PODCAST_SEARCH_ERROR
} from "../constants/action-types";

const initialState = {
	activePodcast: false,
	activeEpisode: false,
	podcastLoading: false,
	podcastLoadingError: false,
	selectedPodcast: false,
	selectedPodcastEpisodes: [],
	subscribedPodcasts: [],
	lastVisitedPodcasts: [],
	searching: false,
	searchError: false,
	searchResults: false,
	searchGenres: false
};

const podcastReducer = (state = initialState, action) => {
	if (action.type === PLAY_EPISODE) {
		// action.payload.episode.currentTime = 0;
		
		return Object.assign({}, state, {
			activePodcast: action.payload.podcast,
			activeEpisode: action.payload.episode
		});
	}
	else if (action.type === PODCAST_VIEW) {
		var newVisitedArray = [...state.lastVisitedPodcasts];
		
		newVisitedArray.unshift(action.payload);
		
		var alreadyExisted = false;
		for(var i=newVisitedArray.length - 1;i>=1;i--) {
			if (newVisitedArray[i].path == action.payload.path) {
				newVisitedArray.splice(i,1);
				alreadyExisted = true;
			}
		}
		if (!alreadyExisted && newVisitedArray.length > 50) {
			newVisitedArray.pop();
		}
		
		return Object.assign({}, state, {
			lastVisitedPodcasts: newVisitedArray
		});
	}
	else if (action.type === PODCAST_SEARCHING) {
		return Object.assign({}, state, {
			searching: true,
			searchError: false
		});
	}
	else if (action.type === PODCAST_SEARCHED) {
		return Object.assign({}, state, {
			searching: false,
			searchResults: action.payload.results,
			searchGenres: action.payload.genres
		});
	}
	else if (action.type === PODCAST_SEARCH_ERROR) {
		return Object.assign({}, state, {
			searching: false,
			searchError: action.payload.errorText			
		});
	}
	else if (action.type === PODCAST_LOADING) {
		return Object.assign({}, state, {
			podcastLoading: true,
			selectedPodcast: false,
			selectedPodcastEpisodes: false,
			podcastLoadingError: false
		});
	}
	else if (action.type === PODCAST_LOAD_ERROR) {
		return Object.assign({}, state, {
			podcastLoading: false,
			podcastLoadingError: true
		});
	}
	else if (action.type === PODCAST_LOADED) {
		// Update subscriptions
		var subscribedPodcasts = [...state.subscribedPodcasts];
		
		var subscribed = false;
		subscribedPodcasts.forEach((subscribedPodcast,index) => {
			if (subscribedPodcast.feedUrl == action.payload.feedUrl) {
				subscribed = true;
				var subscriptionObject = {
					guid: action.payload.guid,
					parentguid: action.payload.parentguid,
					name: action.payload.name,
					path: action.payload.path,
					author: action.payload.author,
					archived: subscribedPodcast.archived,
					description: action.payload.description,
					feedUrl: action.payload.feedUrl,
					link: action.payload.link,
					artworkUrl30: action.payload.artworkUrl30,
					artworkUrl60: action.payload.artworkUrl60,
					artworkUrl100: action.payload.artworkUrl100,
					artworkUrl600: action.payload.artworkUrl600,
					receivedFromServer: action.payload.receivedFromServer
				};
				subscribedPodcasts[index] = subscriptionObject;
			}
		});
		
		return Object.assign({}, state, {
			podcastLoading: false,
			selectedPodcast: {
				guid: action.payload.guid,
				parentguid: action.payload.parentguid,
				name: action.payload.name,
				path: action.payload.path,
				author: action.payload.author,
				description: action.payload.description,
				feedUrl: action.payload.feedUrl,
				link: action.payload.link,
				artworkUrl30: action.payload.artworkUrl30,
				artworkUrl60: action.payload.artworkUrl60,
				artworkUrl100: action.payload.artworkUrl100,
				artworkUrl600: action.payload.artworkUrl600,
				episodes: action.payload.episodes,
				receivedFromServer: action.payload.receivedFromServer
			},
			selectedPodcastEpisodes: action.payload.episodes,
			subscribedPodcasts: subscribedPodcasts
		});
	}
	else if (action.type === PODCAST_SUBSCRIBED) {
		var subscribedPodcasts = [...state.subscribedPodcasts];
		var alreadyExist = false;

		subscribedPodcasts.forEach((subscribedPodcast) => {
			if (subscribedPodcast.feedUrl == action.payload.feedUrl) {
				alreadyExist = true;
			}
		});
		
		if (!alreadyExist) {
			var subscriptionObject = {
				guid: action.payload.guid,
				parentguid: action.payload.parentguid,
				name: action.payload.name,
				path: action.payload.path,
				author: action.payload.author,
				description: action.payload.description,
				feedUrl: action.payload.feedUrl,
				link: action.payload.link,
				artworkUrl30: action.payload.artworkUrl30,
				artworkUrl60: action.payload.artworkUrl60,
				artworkUrl100: action.payload.artworkUrl100,
				artworkUrl600: action.payload.artworkUrl600,
				receivedFromServer: action.payload.receivedFromServer,
				synchronizedWithServer: false
			};
			// console.log(subscriptionObject);
			subscribedPodcasts.push(subscriptionObject);
		}
		return Object.assign({}, state, {
			subscribedPodcasts: subscribedPodcasts
		});
	}
	else if (action.type === PODCAST_UNSUBSCRIBED) {
		var subscribedPodcasts = [...state.subscribedPodcasts];
		
		let index = subscribedPodcasts.length - 1;
		while (index >= 0) {
			if (subscribedPodcasts[index].feedUrl === action.payload.feedUrl) {
				subscribedPodcasts.splice(index,1);
			}
			index--;
		}

		return Object.assign({}, state, {
			subscribedPodcasts: subscribedPodcasts
		});
	}
	else if (action.type === PODCAST_SUBSCRIBED_SUCCESS) {
		subscribedPodcasts.forEach((subscribedPodcast,index) => {
			if (subscribedPodcast.feedUrl == action.payload.feedUrl) {
				subscribedPodcasts[index].synchronizedWithServer = true;
			}
		});
	}
	else if (action.type === PODCAST_SUBSCRIBED_ERROR) {
		// We probably won't do anything here. We'll just try again next time the user opens the app
	}	
	
	else if (action.type === PODCAST_ARCHIVED) {
		var subscribedPodcasts = [...state.subscribedPodcasts];

		subscribedPodcasts.forEach((subscribedPodcast,index) => {
			if (subscribedPodcast.feedUrl == action.payload.feedUrl) {
				subscribedPodcasts[index].archived = true;
			}
		});
		
		return Object.assign({}, state, {
			subscribedPodcasts: subscribedPodcasts
		});
	}
	else if (action.type === PODCAST_UNARCHIVED) {
		var subscribedPodcasts = [...state.subscribedPodcasts];

		subscribedPodcasts.forEach((subscribedPodcast,index) => {
			if (subscribedPodcast.feedUrl == action.payload.feedUrl) {
				subscribedPodcasts[index].archived = false;
			}
		});
		
		return Object.assign({}, state, {
			subscribedPodcasts: subscribedPodcasts
		});
	}
	else if (action.type === EPISODE_FINISHED) {
		var activeEpisode = Object.assign({}, state.activeEpisode);
		activeEpisode.listened = true;
		activeEpisode.listenedDate = new Date();

		// Do we really need to retrieve the cache here, can't we just save the active podcast?
		// localForage.getItem('podcast_cache_' + action.payload.podcast.path)
		//.then((podcastCache) => {
			// if (podcastCache) {
				// console.log(action.payload.episode.episodeIndex);
				// console.log(podcastCache);
				
				// We need to update on the server here as well - also this code probably belongs in an action instead - also we should keep episodes states in a completely different key, and not have episodes all over the place like subscribed, active, selected
				action.payload.podcast.episodes[action.payload.episode.episodeIndex].listened = true;
				action.payload.podcast.episodes[action.payload.episode.episodeIndex].listenedDate = activeEpisode.listenedDate;
				
				// console.log(action.payload.podcast);
				// console.log('podcast_cache_' + action.payload.podcast.path);
				localForage.setItem('podcast_cache_' + action.payload.podcast.path,action.payload.podcast);
				/*
			}
			else {
				console.log('No cache exists!');
			}
		});
		*/
		
		var selectedPodcast = state.selectedPodcast;
		if (state.selectedPodcast.path == action.payload.podcast.path) {
			selectedPodcast = Object.assign({}, state.selectedPodcast);
			selectedPodcast.episodes[action.payload.episode.episodeIndex].listened = true;
			selectedPodcast.episodes[action.payload.episode.episodeIndex].listened = activeEpisode.listenedDate;
		}
		var activePodcast = state.activePodcast;
		if (state.activePodcast.path == action.payload.podcast.path) {
			activePodcast = Object.assign({}, state.activePodcast);
			activePodcast.episodes[action.payload.episode.episodeIndex].listened = true;
			activePodcast.episodes[action.payload.episode.episodeIndex].listened = activeEpisode.listenedDate;
		}
		
		return Object.assign({}, state, {
			selectedPodcast: selectedPodcast,
			activeEpisode: activeEpisode
		});
	}
	else if (action.type === EPISODE_TIME_UPDATED) {
		// console.log('EPISODE_TIME_UPDATED: ' + action.payload);

		var activePodcast = Object.assign({}, state.activePodcast);

		var activeEpisode = Object.assign({}, state.activeEpisode);
		activeEpisode.currentTime = action.payload;
		
		activePodcast.episodes[activeEpisode.episodeIndex].currentTime = action.payload;

		// localForage.getItem('podcast_cache_' + state.activePodcast.path)
		// .then((podcastCache) => {
			// console.log(state.activeEpisode);
			// console.log(podcastCache);
			
			// 1. Do we really need to retrieve the cache here, can't we just save the active podcast?
			// 2. We need to update on the server here as well - also this code probably belongs in an action instead - also we should keep episodes states in a completely different key, and not have episodes all over the place like subscribed, active, selected
			
			// if (podcastCache) {
				// console.log(podcastCache.episodes[state.activeEpisode.episodeIndex]);
				// activePodcast.episodes[state.activeEpisode.episodeIndex].currentTime = action.payload;
				localForage.setItem('podcast_cache_' + state.activePodcast.path,activePodcast)
			// }
		// });
		
		var selectedPodcast = state.selectedPodcast;
		if (selectedPodcast && (selectedPodcast.path == activePodcast.path)) {
			selectedPodcast = Object.assign({}, state.selectedPodcast);
			selectedPodcast.episodes[activeEpisode.episodeIndex].currentTime = action.payload;
		}
		
		return Object.assign({}, state, {
			activePodcast: activePodcast,
			activeEpisode: activeEpisode,
			selectedPodcast: selectedPodcast
		});
	}
	return state;
};
export default podcastReducer;