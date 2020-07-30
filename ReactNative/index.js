/**
 * @format
 */
 
import React from 'react';
 

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AudioController from './library/AudioController.js';

const audioController = new AudioController();

console.log('so this is not refreshed?');

class AppWithAudioController extends React.Component {
	render() {
		return (
			<App audioController={audioController} />
		)
	}
	componentDidMount() {
		// console.log('index.js mounted');
	}
	componentWillUnmount() {
		// console.log('index.js unmounting');
		// audioController.destroy()
	}
}

AppRegistry.registerComponent(appName, () => AppWithAudioController);

audioController.startService();
audioController.init();