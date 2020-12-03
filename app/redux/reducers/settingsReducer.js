import {
	SET_AUDIO_PLAYBACK_SPEED
} from "../constants/setting-types";

const initialState = {
	audioPlaybackSpeed: 1
};

const settingsReducer = (state = initialState, action) => {
	if (action.type === SET_AUDIO_PLAYBACK_SPEED) {
		return Object.assign({}, state, {
			audioPlaybackSpeed: action.payload
		});
	}
	return state;
};
export default settingsReducer;