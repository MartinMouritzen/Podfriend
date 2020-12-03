import {
	UI_SHOW_SPEED_SETTING_WINDOW
} from "../constants/ui-types";

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
