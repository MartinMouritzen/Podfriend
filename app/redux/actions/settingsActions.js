import {
	SET_AUDIO_PLAYBACK_SPEED
} from "../constants/setting-types";

export function setAudioPlaybackSpeed(playbackSpeed) {
	console.log('setting audio speed1');
	return {
		type: SET_AUDIO_PLAYBACK_SPEED,
		payload: Number.parseFloat(playbackSpeed)
	};
}
