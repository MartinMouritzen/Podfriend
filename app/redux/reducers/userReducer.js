import {
	LOGIN_SHOW,
	LOGIN_HIDE,
	FETCH_USER_PROFILE,
	USER_LOGGED_IN,
	USER_NOT_LOGGED_IN,
} from "../constants/action-types";

const initialState = {
	isLoggedIn: false,
	showLogin: false,
	profileData: {}
};

const userReducer = (state = initialState, action) => {
	if (action.type === USER_LOGGED_IN) {
		return Object.assign({}, state, {
			isLoggedIn: true,
			profileData: action.payload
		});
	}
	else if (action.type === USER_NOT_LOGGED_IN) {
		return Object.assign({}, state, {
			isLoggedIn: false,
			profileData: false
		});
	}
	else if (action.type === LOGIN_SHOW) {
		return Object.assign({}, state, {
			showLogin: true
		});
	}
	else if (action.type === LOGIN_HIDE) {
		return Object.assign({}, state, {
			showLogin: false
		});
	}
	return state;
};
export default userReducer;