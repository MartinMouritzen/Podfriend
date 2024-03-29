import {
	UI_SHOW_SPEED_SETTING_WINDOW,
	UI_SHOW_LOGIN,
	UI_HIDE_LOGIN,
	UI_SHOW_FULLPLAYER,
	UI_HIDE_FULLPLAYER,
	UI_SHOW_SHARE_WINDOW,
	UI_SHOW_SLEEPTIMER_WINDOW,
	USER_SYNCING,
	WALLET_SYNCING,
	WALLET_SYNC_COMPLETE,
	WALLET_INVOICE_LOAD,
	WALLET_INVOICE_SUCCESS,
	WALLET_INVOICE_ERROR,
	UI_SHOW_WALLET_WINDOW
} from "../constants/ui-types";

import {
	PODCAST_SYNC_COMPLETE,
	EPISODE_SYNC_COMPLETE
} from '../constants/podcast-types.js';

export function showSpeedSettingWindow() {
	return {
		type: UI_SHOW_SPEED_SETTING_WINDOW,
		payload: true
	};
}
export function hideSpeedSettingWindow() {
	return {
		type: UI_SHOW_SPEED_SETTING_WINDOW,
		payload: false
	};
}
export function showShareWindow() {
	return {
		type: UI_SHOW_SHARE_WINDOW,
		payload: true
	};
}
export function hideShareWindow() {
	return {
		type: UI_SHOW_SHARE_WINDOW,
		payload: false
	};
}
export function showSleepTimer() {
	return {
		type: UI_SHOW_SLEEPTIMER_WINDOW,
		payload: true
	};
}
export function hideSleepTimer() {
	return {
		type: UI_SHOW_SLEEPTIMER_WINDOW,
		payload: false
	};
}

export function initiateLogin() {
	return {
		type: UI_SHOW_LOGIN,
		payload: false
	};
}
export function abortLogin() {
	return {
		type: UI_HIDE_LOGIN,
		payload: false
	};
}
export function showFullPlayer(showing = false) {
	return {
		type: showing ? UI_SHOW_FULLPLAYER : UI_HIDE_FULLPLAYER,
		payload: false
	};
}
export function synchronizePodcasts() {
	return (dispatch,getState) => {
		var minTime = 2000;

		var startTime = new Date();

		dispatch({
			type: USER_SYNCING,
			payload: true
		});

		var { authToken } = getState().user;

		const podcastSynchronizationURL = 'https://api.podfriend.com/user/favorites/';
		return fetch(podcastSynchronizationURL, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${authToken}`
			}
		})
		.then((resp) => {
			return resp.json()
		})
		.then((response) => {
			var endTime = new Date();
			var timeDiff = (endTime - startTime);

			var timeLeft = minTime - timeDiff;

			if (timeLeft < 0) {
				timeLeft = 10;
			}
			
			setTimeout(() => {
				if (response.podcasts) {
					dispatch({
						type: PODCAST_SYNC_COMPLETE,
						payload: response.podcasts
					});
				}
				if (response.episodes) {
					dispatch({
						type: EPISODE_SYNC_COMPLETE,
						payload: response.episodes
					});
				}
				dispatch({
					type: USER_SYNCING,
					payload: false
				});
			},timeLeft);
		})
		.catch((error) => {
			console.log('error synchronizing user data.');
			console.log(error);

			dispatch({
				type: USER_SYNCING,
				payload: false
			});
		});
	};
}
export function synchronizeEpisodeState() {
	return (dispatch,getState) => {
		var { authToken } = getState().user;
		var { activePodcast } = getState().podcast;
		var { activeEpisode } = getState().podcast;

		var percentageListened = (100 * activeEpisode.currentTime) / activeEpisode.duration;

		console.log('activeEpisode.listened');
		console.log(activeEpisode.listened);
		console.log(percentageListened);

		var listened = activeEpisode.listened ? true : percentageListened > 90 ? true : false;
		
		console.log(listened);

		const episodeData = {
			podcastGuid: activePodcast.guid,
			episodeGuid: activeEpisode.guid,
			currentTime: activeEpisode.currentTime,
			listened: listened
		};
		// console.log(activePodcast);
		console.log(activeEpisode);
		console.log(episodeData);

		const episodeSynchronizationURL = 'https://api.podfriend.com/user/sync/episode/';
		return fetch(episodeSynchronizationURL, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${authToken}`
			},
			body: JSON.stringify(episodeData)
		})
		.then((resp) => {
			console.log(resp);
			return resp.json()
		})
		.then((response) => {
			console.log('episode sync done');
			console.log(response);
		})
		.catch((error) => {
			console.log('error synchronizing episode data.');
			console.log(error);
			console.log(episodeSynchronizationURL);
			console.log(episodeData);
		});
	};
}
export function showWalletModal() {
	return {
		type: UI_SHOW_WALLET_WINDOW,
		payload: true
	};
}
export function hideWalletModal() {
	return {
		type: UI_SHOW_WALLET_WINDOW,
		payload: false
	};
}
export function synchronizeWallet() {
	return (dispatch,getState) => {

		dispatch({
			type: WALLET_SYNCING,
			payload: true
		});

		var { authToken } = getState().user;

		const walletBalanceURL = 'https://api.podfriend.com/user/wallet/';
		return fetch(walletBalanceURL, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${authToken}`
			}
		})
		.then((resp) => {
			return resp.json();
		})
		.then((response) => {
			// console.log('WALLET SYNC');
			// console.log(response);

			dispatch({
				type: WALLET_SYNC_COMPLETE,
				payload: {
					walletBalance: response.balance
				}
			});
		})
		.catch((error) => {
			console.log('error synchronizing wallet data.');
			console.log(error);

			dispatch({
				type: WALLET_SYNCING,
				payload: false
			});
		});
	};
}
export function boostPodcast(valueBlock,boostAmount,overrideDestinations = false,senderName = false,message = false) {
	return sendValue(valueBlock,boostAmount,overrideDestinations,'boost',senderName,message);
}
export function sendValue(valueBlock,totalAmount,overrideDestinations = false,actionType = 'stream',senderName = false,message = false) {
	return (dispatch,getState) => {
		var recognizedMethod = false;
		var validDestinations = false;

		if (valueBlock.model && valueBlock.model.method === 'keysend' && valueBlock.model.type === 'lightning') {
			recognizedMethod = true;
		}
		if (overrideDestinations || valueBlock.destinations && valueBlock.destinations.length > 0) {
			validDestinations = true;
		}

		if (recognizedMethod && validDestinations) {
			console.log('sending value');
			console.log(valueBlock);

			var { authToken } = getState().user;
			var { activePodcast, activeEpisode } = getState().podcast;

			// console.log(activePodcast);
			// console.log(activeEpisode);

			var debug = false;
			var async = true;
			if (debug) {
				async = false;
				totalAmount = 10;
			}

			const valueData = {
				valueType: valueBlock.model.type,
				valueMethod: valueBlock.model.method,
				amount: totalAmount,
				destinations: overrideDestinations ? overrideDestinations : valueBlock.destinations,
				actionType: actionType,
				async: async,
				podcastInfo: {
					name: activePodcast.name,
					path: activePodcast.path,
					feedUrl: activePodcast.feedUrl,
					feedId: activePodcast.id,
					episodeName: activeEpisode.title,
					episodeGuid: activeEpisode.guid,
					episodeId: activeEpisode.id,
					currentTime: activeEpisode.currentTime
				}
			};
			if (senderName) {
				valueData.senderName = senderName;
			}
			if (message) {
				valueData.message = message;
			}
			// console.log(valueData);

			const walletInvoiceURL = 'https://api.podfriend.com/user/wallet/keysend/' + (debug ? '?debug=true' : '');
			return fetch(walletInvoiceURL, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${authToken}`
				},
				body: JSON.stringify(valueData)
			})
			.then((resp) => {
				return resp.json()
			})
			.then((response) => {
				console.log('sent value!');
				console.log(response);
				return Promise.resolve({
					success: 1
				});
			})
			.catch((error) => {
				console.log('error sending value');
				console.log(error);

				return Promise.resolve({
					success: 0
				});
			});
		}
	};
}
export function getInvoice(amount) {
	return (dispatch,getState) => {

		dispatch({
			type: WALLET_INVOICE_LOAD,
			payload: true
		});

		var { authToken } = getState().user;

		const walletInvoiceURL = 'https://api.podfriend.com/user/wallet/invoice/?amount=' + amount;
		return fetch(walletInvoiceURL, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${authToken}`
			}
		})
		.then((resp) => {
			return resp.json()
		})
		.then((response) => {
			// console.log('INVOICE!');
			// console.log(response);


			dispatch({
				type: WALLET_INVOICE_SUCCESS,
				payload: response
			});
		})
		.catch((error) => {
			console.log('error getting wallet invoice data.');
			console.log(error);

			dispatch({
				type: WALLET_INVOICE_ERROR,
				payload: 'Error getting wallet invoice data.'
			});
		});
	};
}