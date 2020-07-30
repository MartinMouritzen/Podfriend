import {
	AUDIO_PLAY,
	AUDIO_PAUSE,
	AUDIO_REWIND,
	AUDIO_FORWARD
} from "../constants/action-types";

const initialState = {
	isPlaying: false
};

const userReducer = (state = initialState, action) => {
	if (action.type === AUDIO_PLAY) {
		console.log('audio playing');
		return Object.assign({}, state, {
			isPlaying: true
		});
	}
	else if (action.type === AUDIO_PAUSE) {
		console.log('audio paused');
		return Object.assign({}, state, {
			isPlaying: false
		});
	}
	return state;
};
export default userReducer;