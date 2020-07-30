import {
	LOGIN_SHOW,
	LOGIN_HIDE,
	INITIATE_LOGIN,
	USER_LOGGED_IN,
	USER_NOT_LOGGED_IN,
	EPISODE_TIME_UPDATED,
	PODCAST_LOADING,
	PODCAST_LOADED,
	PODCAST_SUBSCRIBED,
	PODCAST_UNSUBSCRIBED,
	PODCAST_ARCHIVED,
	PODCAST_UNARCHIVED,
	PODCAST_VIEW
	
} from "../constants/action-types";




export function initiateLogin() {
	return {
		type: LOGIN_SHOW,
		payload: false
	};
}
export function abortLogin() {
	return {
		type: LOGIN_HIDE,
		payload: false
	};
}
export function userLoggedIn(userObj) {
	return {
		type: USER_LOGGED_IN,
		payload: userObj
	}
}
export function userNotLoggedIn() {
	console.log('userNotLoggedIn()');
	return {
		type: USER_NOT_LOGGED_IN,
		payload: {}
	}
}
export function updateEpisodeTime(time) {
	return {
		type: EPISODE_TIME_UPDATED,
		payload: time
	}
}

export function subscribeToPodcast(podcast) {
	return {
		type: PODCAST_SUBSCRIBED,
		payload: podcast
	}
}
export function unsubscribeToPodcast(podcast) {
	return {
		type: PODCAST_UNSUBSCRIBED,
		payload: podcast
	}
}

export function fetchUserProfile() {
	return (dispatch) => {
		const podfriendToken = localStorage.podfriendToken;
		
		if (podfriendToken) {
			return fetch("http://api.podfriend.com/authenticate/", {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${podfriendToken}`
				}
			})
			.then((resp) => {
				return resp.json()
			})
			.then((data) => {
				if (data.message || data.error) {
					// An error will occur if the token is invalid.
					// If this happens, you may want to remove the invalid token.
					// localStorage.removeItem("podfriendToken")
					console.log('error loggin user in.');
					console.log(data);
					console.log('token: ' + podfriendToken);
					dispatch(userNotLoggedIn())
				}
				else {
					dispatch(userLoggedIn(data))
				}
			})
			.catch((error) => {
				console.log('error loggin user in.');
				console.log(error);
			});
		}
		else {
			dispatch(userNotLoggedIn())
		}
	}
}