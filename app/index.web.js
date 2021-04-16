import React from 'react';
import { render } from 'react-dom';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import configureStore from './redux/store'

import storage from 'redux-persist/lib/storage';

var [ store, persistor, history ] = configureStore(storage,true);

import Events from './library/Events.js';

import WebContainer from './components/Window/WebContainer';

import ConfigFile from './podfriend.config.js';
/*
import { getPlatforms } from '@ionic/react';

var platforms = getPlatforms();
console.log(platforms);
console.error(platforms);
*/

const environment = process.env.NODE_ENV || 'development';

const config = ConfigFile[environment]['web'];
config.api = ConfigFile[environment]['api'];

window.podfriend = {};
window.podfriend.environment = 'web';
window.podfriend.config = config;

window.Events = Events;

import AudioController from './library/AudioController/WebAudioController.js';

const audioController = new AudioController();
audioController.startService();
audioController.init();


/*
history.listen((location) => {
	console.log('Location changed. Hooray!');
	console.log(history);
	console.log(location);
});
*/

render(
	<WebContainer store={store} persistor={persistor} history={history} platform={process.platform} audioController={audioController} />,
	document.getElementById('root')
);

defineCustomElements(window);

if (module.hot) {
	module.hot.accept('./components/Window/WebContainer',() => {
		// eslint-disable-next-line global-require
		const NextRoot = require('./components/Window/WebContainer').default;
		render(
			<NextRoot store={store} persistor={persistor} history={history} platform={process.platform} audioController={audioController} />,
			document.getElementById('root')
		);
	});
}