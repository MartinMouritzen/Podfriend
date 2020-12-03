import {
	UI_SHOW_SPEED_SETTING_WINDOW,
	UI_HIDE_SPEED_SETTING_WINDOW
} from "../constants/ui-types";

const initialState = {
	showSpeedSettingWindow: false
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
	return state;
};
export default uiReducer;