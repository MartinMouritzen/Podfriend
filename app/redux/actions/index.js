import {
	EPISODE_TIME_UPDATED

} from "../constants/action-types";


export function updateEpisodeTime(time) {
	return {
		type: EPISODE_TIME_UPDATED,
		payload: time
	}
}

