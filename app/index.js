import React from 'react';
import { render } from 'react-dom';

import configureStore from './redux/store'

import storage from 'redux-persist/lib/storage';

var [ store, persistor, history ] = configureStore(storage,true);

import Events from './library/Events.js';

import WindowFrame from './components/Window/WindowFrame';

import ConfigFile from './podfriend.config.js';

const environment = process.env.NODE_ENV || 'development';

const config = ConfigFile[environment]['desktop'];
config.api = ConfigFile[environment]['api'];

window.podfriend = {};
window.podfriend.environment = 'desktop';
window.podfriend.config = config;

window.Events = Events;


import AudioController from './library/AudioController.js';

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
	<WindowFrame store={store} persistor={persistor} history={history} platform={process.platform} audioController={audioController} />,
	document.getElementById('root')
);




if (module.hot) {
	module.hot.accept('./components/Window/WindowFrame',() => {
		// eslint-disable-next-line global-require
		const NextRoot = require('./components/Window/WindowFrame').default;
		render(
			<NextRoot store={store} persistor={persistor} history={history} platform={process.platform} audioController={audioController} />,
			document.getElementById('root')
		);
	});
}