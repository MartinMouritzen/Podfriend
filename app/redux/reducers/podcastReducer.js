import localForage from "localforage";

import { v4 as uuidv4 } from 'uuid';

import {
	LOGIN_SHOW,
	LOGIN_HIDE,
	FETCH_USER_PROFILE,
	USER_LOGGED_IN,
	USER_NOT_LOGGED_IN,
	PLAY_EPISODE, // Should be EPISODE_PLAY
	EPISODE_TIME_UPDATED,
	EPISODE_DURATION_UPDATE,
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
	PODCAST_SEARCH_ERROR,
	PODCAST_SETTINGS_CHANGED,
	REVIEWS_LOADING,
	REVIEWS_LOADED,
	REVIEWS_LOAD_ERROR
} from "../constants/action-types";

import {
	PODCAST_SYNC_COMPLETE,
	EPISODE_SYNC_COMPLETE,
	PODCAST_CONFIG_UPDATE
} from '../constants/podcast-types';

import PodcastUtil from 'podfriend-approot/library/PodcastUtil.js';

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
	searchGenres: false,
	reviews: false,
	reviewsLoading: false,
	reviewsLoadingError: false
};

const podcastReducer = (state = initialState, action) => {
	if (action.type === PLAY_EPISODE) {

		if (action.payload.timeStamp) {
			action.payload.episode.currentTime = action.payload.timeStamp;
		}

		try {
			if (action.payload.podcast.episodes[action.payload.episode.episodeIndex].statsId) {
				action.payload.episode.statsId = action.payload.podcast.episodes[action.payload.episode.episodeIndex].statsId;
			}
			else {
				let statsId = uuidv4();
				action.payload.episode.statsId = statsId;
				action.payload.podcast.episodes[action.payload.episode.episodeIndex].statsId = statsId;
				localForage.setItem('podcast_cache_' + action.payload.podcast.path,action.payload.podcast);
			}
		}
		catch(exception) {
			console.log('exception working on statsid: ');
			console.log(exception);
		}


		
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
	else if (action.type === PODCAST_CONFIG_UPDATE) {
		activePodcast = Object.assign({}, state.activePodcast);

		if (Array.isArray(action.payload.key)) {
			console.log('PODCAST_CONFIG_UPDATE array not supported yet. But get working slacker!');
		}
		else {
			console.log('Podcast updated: ' + action.payload.key + ': ' + action.payload.value);
			activePodcast[action.payload.key] = action.payload.value;
		}
		localForage.setItem('podcast_cache_' + activePodcast.path,activePodcast);

		/*
		if (action.payload.boostAmount) {
			activePodcast.boostAmount = action.payload.boostAmount;
		}
		if (action.payload.streamAmount) {
			activePodcast.streamAmount = action.payload.streamAmount;
		}
		*/

		return Object.assign({}, state, {
			activePodcast: activePodcast
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
		var activeEpisode = state.activeEpisode;

		// Update subscriptions
		var subscribedPodcasts = [...state.subscribedPodcasts];
		
		var subscribed = false;
		subscribedPodcasts.forEach((subscribedPodcast,index) => {
			if (subscribedPodcast.path == action.payload.path) {
				subscribed = true;

				action.payload.archived = subscribedPodcast.archived;
				subscribedPodcasts[index] = action.payload;
			}
		});

		var selectedPodcast = action.payload;

		if (action.payload.episodes) {
			// console.log('resorting and reindexing after podcast load');
			action.payload.episodes = PodcastUtil.sortEpisodes(action.payload.episodes,action.payload.sortBy,action.payload.sortType);
			activeEpisode = PodcastUtil.reindexActiveEpisode(activeEpisode,action.payload.episodes);
		}
		
		return Object.assign({}, state, {
			podcastLoading: false,
			selectedPodcast: action.payload,
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
			/*
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
			*/
			action.payload.synchronizedWithServer = false;
			subscribedPodcasts.push(action.payload);
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
	else if (action.type === EPISODE_DURATION_UPDATE) {
		var activePodcast = Object.assign({}, state.activePodcast);

		var activeEpisode = Object.assign({}, state.activeEpisode);
		activeEpisode.duration = action.payload.duration;

		activePodcast.episodes[activeEpisode.episodeIndex].duration = action.payload.duration;

		localForage.setItem('podcast_cache_' + state.activePodcast.path,activePodcast);
		
		var selectedPodcast = state.selectedPodcast;
		if (selectedPodcast && (selectedPodcast.path == activePodcast.path)) {
			selectedPodcast = Object.assign({}, state.selectedPodcast);
			selectedPodcast.episodes[activeEpisode.episodeIndex].duration = action.payload.duration;
		}
		
		return Object.assign({}, state, {
			activePodcast: activePodcast,
			activeEpisode: activeEpisode,
			selectedPodcast: selectedPodcast
		});
	}
	else if (action.type === EPISODE_TIME_UPDATED) {
		var activePodcast = Object.assign({}, state.activePodcast);
		var activeEpisode = Object.assign({}, state.activeEpisode);
		activeEpisode.currentTime = action.payload;

		try {
			activePodcast.episodes[activeEpisode.episodeIndex].currentTime = action.payload;
		}
		catch (exception) {
			// Seen example where this happens on iphone, where activePodcast.episodes is false
			console.log('exception while setting currentTime on episodes');
			console.log(exception);
			console.log(activePodcast);
			console.log(activePodcast.episodes);
			console.log(activeEpisode.episodeIndex);
			console.log(activeEpisode);
			
		}
		localForage.setItem('podcast_cache_' + activePodcast.path,activePodcast);

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
	else if (action.type === REVIEWS_LOADING) {
		return Object.assign({}, state, {
			reviews: false,
			reviewsLoading: true,
			reviewsLoadingError: false
		});
	}
	else if (action.type === REVIEWS_LOADED) {
		console.log(action.payload);
		return Object.assign({}, state, {
			reviews: action.payload.reviews,
			totalCountReviews: action.payload.totalCountReviews,
			totalScore: action.payload.totalScore,
			reviewsLoading: true,
			reviewsLoadingError: false
		});
	}
	else if (action.type === REVIEWS_LOAD_ERROR) {
		return Object.assign({}, state, {
			reviews: false,
			reviewsLoading: false,
			reviewsLoadingError: true
		});
	}
	else if (action.type === PODCAST_SETTINGS_CHANGED) {
		var selectedPodcast = state.selectedPodcast;
		var activeEpisode = state.activeEpisode;

		var newEpisodes = false;
		if (selectedPodcast.episodes) {
			if (action.payload.sortBy != selectedPodcast.sortBy || action.payload.sortType != selectedPodcast.sortType) {
				newEpisodes = PodcastUtil.sortEpisodes(selectedPodcast.episodes,action.payload.sortBy,action.payload.sortType);
				activeEpisode = PodcastUtil.reindexActiveEpisode(activeEpisode,selectedPodcast.episodes);
			}
		}

		if (state.selectedPodcast.path == action.payload.podcastPath) {
			selectedPodcast = Object.assign({}, state.selectedPodcast);
			selectedPodcast.sortBy = action.payload.sortBy;
			selectedPodcast.sortType = action.payload.sortType;
			selectedPodcast.onlySeason = action.payload.onlySeason;
			selectedPodcast.hideListenedEpisodes = action.payload.hideListenedEpisodes;
			if (newEpisodes !== false) {
				selectedPodcast.episodes = newEpisodes;
			}
		}
		var activePodcast = state.activePodcast;
		if (state.activePodcast.path == action.payload.podcastPath) {
			activePodcast = Object.assign({}, state.activePodcast);
			activePodcast.sortBy = action.payload.sortBy;
			activePodcast.sortType = action.payload.sortType;
			activePodcast.onlySeason = action.payload.onlySeason;
			activePodcast.hideListenedEpisodes = action.payload.hideListenedEpisodes;
			if (activePodcast && newEpisodes !== false) {
				activePodcast.episodes = newEpisodes;
			}
		}
		
		// Save updates to the cache
		localForage.setItem('podcast_cache_' + state.selectedPodcast.path,selectedPodcast);

		return Object.assign({}, state, {
			selectedPodcast: selectedPodcast,
			activePodcast: activePodcast
		});
	}
	else if (action.type === EPISODE_SYNC_COMPLETE) {
		console.log('episode sync');
		console.log(action.payload);
	}
	else if (action.type === PODCAST_SYNC_COMPLETE) {
		// console.log('PODCAST_SYNC_COMPLETE');
		// console.log(action.payload);

		var subscribedPodcasts = [...state.subscribedPodcasts];

		// console.log(subscribedPodcasts);

		action.payload.forEach((podcast) => {
			var found = false;
			subscribedPodcasts.forEach((subscribedPodcast,index) => {
				if (subscribedPodcast.guid == podcast.guid) {
					found = true;
				}
			});
			if (!found) {
				subscribedPodcasts.push(podcast);
			}
		});
		
		return Object.assign({}, state, {
			subscribedPodcasts: subscribedPodcasts
		});
	}
	return state;
};
export default podcastReducer;