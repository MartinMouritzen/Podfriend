import {
	SET_AUDIO_PLAYBACK_SPEED,
	SET_CONFIG_OPTION
} from "../constants/setting-types";

export function setAudioPlaybackSpeed(playbackSpeed) {
	return {
		type: SET_AUDIO_PLAYBACK_SPEED,
		payload: Number.parseFloat(playbackSpeed)
	};
}

export function setConfigOption(key,value) {
	return {
		type: SET_CONFIG_OPTION,
		payload: {
			key: key,
			value: value
		}
	};
}