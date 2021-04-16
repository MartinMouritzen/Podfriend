import { Media } from '@ionic-native/media';

import AudioController from 'podfriend-approot/library/AudioController/AudioController.js';

const onDeviceReady = () => {
	console.log('DEVICE READY');
	console.log(Media);
};
console.log(Media);

var media = Media.create('https://hwcdn.libsyn.com/p/6/0/e/60e240a1beba94de/07_The_Iceberg.mp3?c_id=63603521&cs_id=63603521&destination_id=1171880&expiration=1618437398&hwt=f44cfade617bc2defee8b27b237fd44d');
console.log(media);

setTimeout(() => {
	console.log('after 5 secs');
	media.play();
	console.log('after media play');
},5000);
 console.log('after media play init');

 media.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

	media.onStatus = (id, msgType, value) => {
		console.log('media onStatus!!!');
		console.log(id);
		console.log(msgType);
		console.log(value);
	}

 media.onSuccess.subscribe(() => console.log('Action is successful'));
 
 media.onError.subscribe(error => console.log('Error!', error));


document.addEventListener("deviceready", onDeviceReady, false);

console.log('platforms');

class NativeMobileAudioController extends AudioController {
	
}