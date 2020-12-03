import ConfigFile from 'podfriend-approot/podfriend.config.js';

const environment = process.env.NODE_ENV || 'development';

const config = ConfigFile[environment]['desktop'];
config.api = ConfigFile[environment]['api'];

import ClientStorage from 'podfriend-storage';

var clientStorage = new ClientStorage();

var abortController = new AbortController();
var fetchingPodcast = false;

var reviewsAbortController = new AbortController();
var fetchingReviews = false;

import PodCastService from './../../library/PodCastService.js';

var services = {};
services['itunes'] = new PodCastService('ITunes',config.proxyPodcastVendorRequests,config.api);

import {
	AUDIO_REQUEST_PLAY,
	PLAY_EPISODE,
	EPISODE_REQUEST_PLAY,
	EPISODE_TIME_UPDATED,
	EPISODE_DURATION_UPDATE,
	EPISODE_FINISHED,
	PODCAST_LOADING,
	PODCAST_LOADED,
	PODCAST_LOAD_ERROR,
	PODCAST_SUBSCRIBED,
	PODCAST_UNSUBSCRIBED,
	PODCAST_SUBSCRIBED_SUCCESS,
	PODCAST_SUBSCRIBED_ERROR,
	PODCAST_SETTINGS_CHANGED,
	PODCAST_ARCHIVED,
	PODCAST_UNARCHIVED,
	PODCAST_VIEW,
	PODCAST_SEARCHING,
	PODCAST_SEARCHED,
	PODCAST_SEARCH_ERROR,
	REVIEWS_LOADING,
	REVIEWS_LOADED,
	REVIEWS_LOAD_ERROR
} from "../constants/action-types";

/**
*
*/
export function updateEpisodeTime(time) {
	return {
		type: EPISODE_TIME_UPDATED,
		payload: time
	};
}
export function updateEpisodeDuration(duration) {
	return {
		type: EPISODE_DURATION_UPDATE,
		payload: {
			duration: duration
		}
	};
}
/**
*
*/
export function playEpisode(podcast,episode) {

	console.log('playEpisode');
	/*
	console.log(podcast);
	console.log(episode);
	*/
	
	var episodeIndex = 0;
	for(var i=0;i<podcast.episodes.length;i++) {
		if (podcast.episodes[i].url == episode.url) {
			episodeIndex = i;
		}
	}
	episode.episodeIndex = episodeIndex;
	
	return (dispatch) => {
		dispatch({
			type: PLAY_EPISODE,
			payload: {
				podcast: podcast,
				episode: episode
			}
		});
		dispatch({
			type: AUDIO_REQUEST_PLAY,
			payload: {
				
			}
		});
	};
	
	
	
	/*
	return {
		type: PLAY_EPISODE,
		payload: {
			podcast: podcast,
			episode: episode
		},
		meta: {
			offline: {
				effect: { url: 'https://api.podfriend.com/test123', method: 'POST', json: { abc: 'test' } },
				commit: { type: 'TEST1', meta: { abc: 'test1' } },
				rollback: { type: 'TEST2', meta: { abc: 'test2' } }
			}
		}
	};
	*/
}
/**
*
*/
export function episodeFinished(podcast,episode) {
	return {
		type: EPISODE_FINISHED,
		payload: {
			podcast: podcast,
			episode: episode
		}
	};
}
export function searchPodcasts(query,searchType = 'podcast',authorName = false,authorId = false) {
	return (dispatch) => {
		dispatch({
			type: PODCAST_SEARCHING,
			payload: {}
		});

		var service = services['itunes'];
		return service.search(query,{ authorName: authorName, authorId: authorId },searchType)
		.then((results) => {
			var genres = [];
			var genreKeys = {};
			if (results.forEach) {
				results.forEach((podcast) => {
					if (podcast.genres) {
						podcast.genres.forEach((genre) => {
							if (!genreKeys[genre]) {
								genreKeys[genre] = true;
							}
						});
					}
				});
			}
			for (var genre in genreKeys) {
				genres.push(genre);
			}
			
			dispatch({
				type: PODCAST_SEARCHED,
				payload: {
					results: results,
					genres: genres
				}
			});
		})
		.catch((error) => {
			var errorText = 'Error while searching for the podcast. Error message: ' + error.message;
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(errorText);
				
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
				
				errorText += ' code: 1.';
			}
			else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(errorText);
				
				console.log(error.request);
				
				errorText += '. Code: 2';
				errorText += JSON.stringify(error.request);
				errorText += JSON.stringify(error.config);
				errorText += JSON.stringify(error.headers);
				errorText += JSON.stringify(error.status);
				errorText += JSON.stringify(error.data);
			}
			else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error in search service: ',error.message);
				
				errorText += ' code: 3';
			}
			dispatch({
				type: PODCAST_SEARCH_ERROR,
				payload: {
					errorText: errorText
				}
			});
		});
	};
}
/**
*
*/
export function viewPodcast(podcastPath) {
	console.log('loading episodes');
	return (dispatch,getState) => {
		if (fetchingPodcast) {
			console.log('was fetching, aborted old request');
			abortController.abort();
			fetchingPodcast = false;
		}

		var dispatchedPodcastView = false;
		
		dispatch({
			type: PODCAST_LOADING,
			payload: {}
		});
		
		const { authToken } = getState().user;

		return clientStorage.getItem('podcast_cache_' + podcastPath)
		.then((podcastCache) => {
			var shouldUpdate = false;
			
			if (podcastCache) {
				dispatch({
					type: PODCAST_LOADED,
					payload: podcastCache
				});
				dispatch({
					type: PODCAST_VIEW,
					payload: podcastCache
				});
				dispatchedPodcastView = true;
				
				if (!podcastCache.receivedFromServer) {
					console.log('strange, no podcastCache.receivedFromServer. This should not happen.');
					shouldUpdate = true;
				}
				else {
					var minutesSinceLastUpdate = Math.floor((Math.abs(new Date() - podcastCache.receivedFromServer)/1000)/60);
				
					if (isNaN(minutesSinceLastUpdate) || minutesSinceLastUpdate > 5) {
						console.log('More than 5 minutes since last update. Fetching new version of: ' + podcastCache.name);
						shouldUpdate = true;
					}
				}
			}
			else {
				console.log('Did not have a cached version');
				shouldUpdate = true;
			}

			if (shouldUpdate) {
				var podcastAPIURL = "https://api.podfriend.com/podcast/" + podcastPath;

				fetchingPodcast = true;
				abortController = new AbortController();
				return fetch(podcastAPIURL, {
					method: "GET",
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Authorization': `Bearer ${authToken}`
					},
					signal: abortController.signal
				})
				.then((resp) => {
					return resp.json()
				})
				.then((data) => {
					fetchingPodcast = false;
					if (data.error) {
						console.log('Error fetching podcast in Redux::fetchPodcast');
						console.log(data.error);
						
						dispatch({
							type: PODCAST_LOAD_ERROR,
							payload: false
						});
					}
					else {
						console.log('Received new version of: ' + data.name);
						data.receivedFromServer = new Date();

						// Make sure we pass the status of the podcast. This should come from the server though.
						if (podcastCache) {
							data.archived = podcastCache.archived;
							data.sortBy = podcastCache.sortBy;
							data.sortType = podcastCache.sortType;
							data.onlySeason = podcastCache.onlySeason;
							data.hideListenedEpisodes = podcastCache.hideListenedEpisodes;
						}

						clientStorage.setItem('podcast_cache_' + podcastPath,data);
						
						// Recreate listened states THIS SHOULD BE TEMPORARY UNTIL WE CAN GET IT FROM THE SERVER
						if (podcastCache && data && data.episodes) {
							for (var i=0;i<data.episodes.length;i++) {
								for (var x=0;x<podcastCache.episodes.length;x++) {
									if (data.episodes[i].url == podcastCache.episodes[x].url) {
										data.episodes[i].currentTime = podcastCache.episodes[x].currentTime;
										data.episodes[i].listened = podcastCache.episodes[x].listened ? true : false;
										break;
									}
								}
							}
						}

						dispatch({
							type: PODCAST_LOADED,
							payload: data
						});
						
						if (!dispatchedPodcastView) {
							dispatch({
								type: PODCAST_VIEW,
								payload: data
							});
						}
					}
				})
				.catch((error) => {
					console.log('Error2 fetching podcast in Redux::fetchPodcast: ' + error);
					console.log('We should not dispatch a redux error if this is an abort.');
					console.log(error);
					
					dispatch({
						type: PODCAST_LOAD_ERROR,
						payload: false
					});
				})
			}
		});
	}
}
/**
*
*/
export function archivePodcast(podcast) {
	return {
		type: PODCAST_ARCHIVED,
		payload: podcast
	}
}
/**
*
*/
export function unarchivePodcast(podcast) {
	return {
		type: PODCAST_UNARCHIVED,
		payload: podcast
	}
}

/**
*
*/
export function updatePodcastSettings(podcastPath,sortBy,sortType,onlySeason,hideListenedEpisodes) {
	console.log('updatePodcastSettings');
	return {
		type: PODCAST_SETTINGS_CHANGED,
		payload: {
			podcastPath: podcastPath,
			sortBy: sortBy,
			sortType: sortType,
			onlySeason: onlySeason,
			hideListenedEpisodes: hideListenedEpisodes
		}
	}
}

export function subscribeToPodcast(podcast) {
	return (dispatch, getState) => {

		const { isLoggedIn, authToken } = getState().user;
		
		console.log('subscribeToPodcast - user is logged in: ' + isLoggedIn + ':' + authToken);
		
		// headers.Authorization = `Bearer ${token}`;
		
		dispatch({
			type: PODCAST_SUBSCRIBED,
			payload: podcast,
			meta: {
				offline: {
					effect: {
						url: 'https://api.podfriend.com/user/favorites/',
						method: 'POST',
						json: {
							podcastPath: podcast.path
						},
						headers: {
							'Authorization': `Bearer ${authToken}`
						}
					},
					commit: { type: 'PODCAST_SUBSCRIBED_SUCCESS', meta: { podcast: podcast } },
					rollback: { type: 'PODCAST_SUBSCRIBED_ERROR', meta: { podcast: podcast } }
				}
			}
		});
	};
}
export function unsubscribeToPodcast(podcast) {
	return {
		type: PODCAST_UNSUBSCRIBED,
		payload: podcast
	}
}

/**********************
* Reviews
**********************/
export function loadReviews(podcastGuid) {
	console.log('loading reviews');
	return (dispatch,getState) => {
		if (fetchingReviews) {
			console.log('was fetching reviews, aborted old request');
			reviewsAbortController.abort();
			fetchingPodcast = false;
		}

		dispatch({
			type: REVIEWS_LOADING,
			payload: {}
		});
		
		const { authToken } = getState().user;

		return clientStorage.getItem('podcast_reviews_cache_' + podcastGuid)
		.then((podcastCache) => {
			var shouldUpdate = false;

			if (podcastCache) {
				dispatch({
					type: REVIEWS_LOADED,
					payload: podcastCache
				});
				
				if (!podcastCache.receivedFromServer) {
					console.log('strange, no podcastCache.receivedFromServer. This should not happen.');
					shouldUpdate = true;
				}
				else {
					var minutesSinceLastUpdate = Math.floor((Math.abs(new Date() - podcastCache.receivedFromServer)/1000)/60);
				
					if (isNaN(minutesSinceLastUpdate) || minutesSinceLastUpdate > 5) {
						console.log('More than 5 minutes since last update. Fetching new version of reviews for podcast with guid: ' + podcastGuid);
						shouldUpdate = true;
					}
				}
			}
			else {
				console.log('Did not have a cached version');
				shouldUpdate = true;
			}

			if (shouldUpdate) {
				var podcastAPIURL = "https://api.podfriend.com/podcast/reviews/?podcastGuid=" + podcastGuid;

				fetchingPodcast = true;
				reviewsAbortController = new AbortController();
				return fetch(podcastAPIURL, {
					method: "GET",
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Authorization': `Bearer ${authToken}`
					},
					signal: reviewsAbortController.signal
				})
				.then((resp) => {
					return resp.json()
				})
				.then((data) => {
					fetchingPodcast = false;
					if (data.error) {
						console.log('Error fetching reviews in Redux::loadReviews');
						console.log(data.error);
						
						dispatch({
							type: REVIEWS_LOAD_ERROR,
							payload: false
						});
					}
					else {
						data.receivedFromServer = new Date();
						
						for (var i=0;i<data.reviews.length;i++) {
							data.reviews[i].reviewDate = Date.parse(data.reviews[i].reviewDate);
						}
						
						clientStorage.setItem('podcast_reviews_cache_' + podcastGuid,data);

						dispatch({
							type: REVIEWS_LOADED,
							payload: data
						});
					}
				})
				.catch((error) => {
					console.log('Error2 fetching podcast in Redux::loadReviews: ' + error);
					console.log('We should not dispatch a redux error if this is an abort.');
					console.log(error);
					
					dispatch({
						type: REVIEWS_LOAD_ERROR,
						payload: false
					});
				})
			}
		});
	}
}