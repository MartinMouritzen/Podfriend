import {
	UI_SHOW_SPEED_SETTING_WINDOW,
	UI_SHOW_LOGIN,
	UI_HIDE_LOGIN,
	UI_SHOW_FULLPLAYER,
	UI_HIDE_FULLPLAYER,
	UI_SHOW_SHARE_WINDOW,
	UI_SHOW_SLEEPTIMER_WINDOW,
	USER_SYNCING
} from "../constants/ui-types";

import {
	PODCAST_SYNC_COMPLETE
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

			// console.log(response);
			
			setTimeout(() => {
				if (response.podcasts) {
					dispatch({
						type: PODCAST_SYNC_COMPLETE,
						payload: response.podcasts
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