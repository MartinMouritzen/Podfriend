import {
	UI_SHOW_SPEED_SETTING_WINDOW,
	UI_HIDE_SPEED_SETTING_WINDOW,
	UI_SHOW_LOGIN,
	UI_HIDE_LOGIN,
	UI_SHOW_FULLPLAYER,
	UI_HIDE_FULLPLAYER
} from "../constants/ui-types";

const initialState = {
	showSpeedSettingWindow: false,
	showLogin: false,
	showFullPlayer: false
};

const uiReducer = (state = initialState, action) => {
	if (action.type === UI_SHOW_SPEED_SETTING_WINDOW) {
		return Object.assign({}, state, {
			showSpeedSettingWindow: action.payload
		});
	}
	else if (action.type === UI_HIDE_SPEED_SETTING_WINDOW) {
		return Object.assign({}, state, {
			showSpeedSettingWindow: action.payload
		});
	}
	else if (action.type === UI_SHOW_LOGIN) {
		return Object.assign({}, state, {
			showLogin: true
		});
	}
	else if (action.type === UI_HIDE_LOGIN) {
		return Object.assign({}, state, {
			showLogin: false
		});
	}
	else if (action.type === UI_SHOW_FULLPLAYER) {
		return Object.assign({}, state, {
			showFullPlayer: true
		});
	}
	else if (action.type === UI_HIDE_FULLPLAYER) {
		return Object.assign({}, state, {
			showFullPlayer: false
		});
	}
	return state;
};
export default uiReducer;