import {
	AUDIO_PLAY,
	AUDIO_PAUSE,
	AUDIO_REWIND,
	AUDIO_FORWARD,
	AUDIO_CAN_PLAY,
	AUDIO_BUFFERING,
	AUDIO_REQUEST_PLAY
} from "../constants/action-types";

export function audioPlaying() {
	return {
		type: AUDIO_PLAY,
		payload: false
	}
}
export function audioPaused() {
	return {
		type: AUDIO_PAUSE,
		payload: false
	}
}
export function audioCanPlay() {
	return {
		type: AUDIO_CAN_PLAY,
		payload: {

		}
	};
}
export function audioBuffering() {
	return {
		type: AUDIO_BUFFERING,
		payload: {

		}
	};
}

export function audioPlayRequested() {
	return {
		type: AUDIO_REQUEST_PLAY,
		payload: {

		}
	};
}