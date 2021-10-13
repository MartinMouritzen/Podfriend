import React from 'react';
import { render } from 'react-dom';

import configureStore from './redux/store'

var [ store, persistor, history ] = configureStore(true);

import Events from './library/Events.js';

import WindowFrame from './components/AppUI/AppWindow/AppWindow.jsx';

import ConfigFile from './podfriend.config.js';

const environment = process.env.NODE_ENV || 'development';

const config = ConfigFile[environment]['desktop'];
config.api = ConfigFile[environment]['api'];

window.podfriend = {};
window.podfriend.environment = 'desktop';
window.podfriend.config = config;

window.Events = Events;

import AudioController from './library/AudioController/WebAudioController.js';

const audioController = new AudioController();
audioController.startService();
audioController.init();

render(
	<WindowFrame store={store} persistor={persistor} history={history} platform={process.platform} audioController={audioController} />,
	document.getElementById('root')
);

if (module.hot) {
	module.hot.accept('./components/AppUI/AppWindow/AppWindow',() => {
		// eslint-disable-next-line global-require
		const NextRoot = require('./components/AppUI/AppWindow/AppWindow').default;
		render(
			<NextRoot store={store} persistor={persistor} history={history} platform={process.platform} audioController={audioController} />,
			document.getElementById('root')
		);
	});
}