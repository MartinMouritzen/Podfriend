import {
	UI_SHOW_SPEED_SETTING_WINDOW,
	UI_SHOW_LOGIN,
	UI_HIDE_LOGIN,
	UI_SHOW_FULLPLAYER,
	UI_HIDE_FULLPLAYER,
	UI_SHOW_SHARE_WINDOW,
	UI_SHOW_SLEEPTIMER_WINDOW
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