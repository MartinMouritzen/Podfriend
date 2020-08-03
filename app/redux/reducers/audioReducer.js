import {
	AUDIO_PLAY,
	AUDIO_PAUSE,
	AUDIO_REWIND,
	AUDIO_FORWARD,
	AUDIO_CAN_PLAY,
	AUDIO_BUFFERING,
	AUDIO_REQUEST_PLAY
} from "../constants/action-types";

const initialState = {
	isPlaying: false,
	shouldPlay: false,
	canPlay: false,
	isBuffering: false
};

const userReducer = (state = initialState, action) => {
	if (action.type === AUDIO_BUFFERING) {
		return Object.assign({}, state, {
			isBuffering: true,
			canPlay: false
		});
	}
	else if (action.type === AUDIO_CAN_PLAY) {
		return Object.assign({}, state, {
			isBuffering: false,
			canPlay: true
		});
	}
	else if (action.type === AUDIO_REQUEST_PLAY) {
		console.log('AUDIO_REQUEST_PLAY reducer');
		return Object.assign({}, state, {
			shouldPlay: true
		});
	}
	else if (action.type === AUDIO_PLAY) {
		console.log('audio playing');
		return Object.assign({}, state, {
			shouldPlay: true,
			isPlaying: true
		});
	}
	else if (action.type === AUDIO_PAUSE) {
		console.log('audio paused');
		return Object.assign({}, state, {
			isPlaying: false,
			shouldPlay: false
		});
	}
	return state;
};
export default userReducer;