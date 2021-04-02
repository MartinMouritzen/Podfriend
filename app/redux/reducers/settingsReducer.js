import {
	SET_AUDIO_PLAYBACK_SPEED,
	SET_CONFIG_OPTION
} from "../constants/setting-types";

const initialState = {
	audioPlaybackSpeed: 1,
	volumeLevel: 1,
	value4ValueEnabled: false,
	value4ValueOnboarded: false,
	defaultBoost: 1000,
	defaultStreamPerMinuteAmount: 10
};

const settingsReducer = (state = initialState, action) => {
	if (action.type === SET_AUDIO_PLAYBACK_SPEED) {
		return Object.assign({}, state, {
			audioPlaybackSpeed: action.payload
		});
	}
	else if (action.type === SET_CONFIG_OPTION) {
		var newState = Object.assign({}, state, {
			
		});

		if (action.payload.key) {
			newState[action.payload.key] = action.payload.value;
		}
		return newState;
	}
	return state;
};
export default settingsReducer;