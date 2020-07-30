import {
	AUDIO_PLAY,
	AUDIO_PAUSE,
	AUDIO_REWIND,
	AUDIO_FORWARD,
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
export function audioPlayRequested(podcast,episode) {
	return {
		type: AUDIO_REQUEST_PLAY,
		payload: {
			podcast: podcast,
			episode: episode
		}
	};
}