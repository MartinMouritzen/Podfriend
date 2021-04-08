import {
	AUTH_TOKEN_RECEIVED,
	LOGIN_SHOW,
	LOGIN_HIDE,
	INITIATE_LOGIN,
	USER_LOGGED_IN,
	USER_NOT_LOGGED_IN,
	USER_LOGGED_OUT
} from "../constants/action-types";

/*
import {
	
} from "../constants/user-types";
*/

export function userLogout() {
	return {
		type: USER_LOGGED_OUT,
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
export function authTokenReceived(authToken) {
	return {
		type: AUTH_TOKEN_RECEIVED,
		payload: authToken
	}
}
export function authenticateUser(preserveLoginForm = false) {
	return (dispatch,getState) => {
		var { authToken } = getState().user;

		if (authToken) {
			return fetch("https://api.podfriend.com/authenticate/", {
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
			.then((data) => {
				if (data.message || data.error) {
					// An error will occur if the token is invalid.
					// If this happens, you may want to remove the invalid token.
					// localStorage.removeItem("authToken")
					console.log('error loggin user in.');
					console.log(data);
					console.log('token: ' + authToken);
					dispatch(userNotLoggedIn())
				}
				else {
					data.preserveLoginForm = preserveLoginForm;
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