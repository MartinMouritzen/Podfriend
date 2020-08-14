import TrackPlayer from 'react-native-track-player';

/*
module.exports = async function () {
    TrackPlayer.addEventListener('remote-play', async () => {
    	console.log('remote-play');
    	await TrackPlayer.play();
    });
    TrackPlayer.addEventListener('remote-pause', async () => {
    	console.log('remote-pause');
    	await TrackPlayer.pause();
    });
    TrackPlayer.addEventListener('remote-stop', async () => {
    	console.log('remote-stop');
    	await TrackPlayer.destroy();
    });
    TrackPlayer.addEventListener('remote-jump-backward', async () => {
    	TrackPlayer.seekTo(await TrackPlayer.getPosition() - 15);
    });
    TrackPlayer.addEventListener('remote-jump-forward', async () => {
    	TrackPlayer.seekTo(await TrackPlayer.getPosition() + 15);
    });
    TrackPlayer.addEventListener('remote-next', async () => {
    	await TrackPlayer.skipToNext();
    });
    TrackPlayer.addEventListener('remote-previous', async () => {
    	await TrackPlayer.skipToPrevious();
    });
}
*/

module.exports = (audioController) => {
	return async () => {
	    TrackPlayer.addEventListener('remote-play', async () => {
	    	console.log('remote-play');
	    	await audioController.play();
	    });
	    
	    TrackPlayer.addEventListener('remote-play-id', async () => {
	    	console.log('remote-play-id: NOT SUPPORTED YET');
	    });
	    
	    TrackPlayer.addEventListener('remote-play-search', async () => {
	    	console.log('remote-play-search: NOT SUPPORTED YET');
	    });
	    
	    TrackPlayer.addEventListener('remote-pause', async () => {
	    	console.log('remote-pause');
	    	await audioController.pause();
	    });
	    TrackPlayer.addEventListener('remote-stop', async () => {
	    	console.log('remote-stop');
	    	await audioController.destroy();
	    });
	    
	    TrackPlayer.addEventListener('remote-skip', async () => {
	    	console.log('remote-skip: NOT SUPPORTED YET');
	    });
	    
	    TrackPlayer.addEventListener('remote-jump-backward', async () => {
	    	// TrackPlayer.seekTo(await TrackPlayer.getPosition() - 15);
	    	console.log('remote-jump-backward');
	    	audioController.rewind();
	    });
	    TrackPlayer.addEventListener('remote-jump-forward', async () => {
	    	// TrackPlayer.seekTo(await TrackPlayer.getPosition() + 15);
	    	console.log('remote-jump-forward');
	    	audioController.forward();
	    });
	    TrackPlayer.addEventListener('remote-next', async () => {
	    	console.log('remote-next');
	    	// await TrackPlayer.skipToNext();
	    	audioController.nextTrack();
	    });
	    TrackPlayer.addEventListener('remote-previous', async () => {
	    	console.log('remote-previous');
	    	// await TrackPlayer.skipToPrevious();
	    	audioController.previousTrack();
	    });
	    
	    TrackPlayer.addEventListener('remote-seek', async () => {
	    	console.log('remote-seek: NOT SUPPORTED YET');
	    });
	    
	    TrackPlayer.addEventListener('remote-set-rating', async () => {
	    	console.log('remote-play-id: NOT SUPPORTED YET');
	    });
	    
	    TrackPlayer.addEventListener('remote-duck', async (paused,permanent) => {
			/* 
			A tutorial (not necessarily for duck) here: https://www.youtube.com/watch?v=ws-g10jKE6E&list=PLzQWIQOqeUSPpi4MwvYh1j-KvK_e_yq8W&index=8
			
			
			
			When the event is triggered with permanent set to true, you should stop the playback.
			When the event is triggered with paused set to true, you should pause the playback. It will also be set to true when permanent is true.
			When the event is triggered and none of them are set to true, you should resume the track.
			
			Suggestion on how to implement it from https://github.com/react-native-kit/react-native-track-player/issues/505
			
				let playingBeforeDuck;
				  let volumeBeforeDuck;
				  const DUCKED_VOLUME = 0.2;
				  TrackPlayer.addEventListener(
				    'remote-duck',
				    async ({ paused, permanent, ducking }) => {
				      if (permanent) {
				        TrackPlayer.stop();
				        return;
				      }

				      if (paused) {
				        const playerState = await TrackPlayer.getState();
				        playingBeforeDuck = playerState === TrackPlayer.STATE_PLAYING;
				        TrackPlayer.pause();
				        return;
				      }

				      if (ducking) {
				        const volume = await TrackPlayer.getVolume();
				        if (volume > DUCKED_VOLUME) {
				          volumeBeforeDuck = volume;
				          TrackPlayer.setVolume(DUCKED_VOLUME);
				        }
				        return;
				      }

				      if (playingBeforeDuck) {
				        TrackPlayer.play();
				      }

				      const playerVolume = await TrackPlayer.getVolume();
				      if (volumeBeforeDuck > playerVolume) {
				        TrackPlayer.setVolume(volumeBeforeDuck || 1);
				      }

				      volumeBeforeDuck = playingBeforeDuck = null;
				    }
				  );
			
			
			*/
	    	console.log('remote-duck: NOT SUPPORTED YET');
	    });
	};
}