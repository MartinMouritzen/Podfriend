import React from 'react';
import { render } from 'react-dom';

import store from "./redux/store";

import Events from './library/Events.js';

import WindowFrame from './components/Window/WindowFrame';

import ConfigFile from './podfriend.config.js';

const environment = process.env.NODE_ENV || 'development';

const config = ConfigFile[environment]['web'];
config.api = ConfigFile[environment]['api'];

window.podfriend = {};
window.podfriend.environment = 'web';
window.podfriend.config = config;

window.Events = Events;

render(
	<WindowFrame store={store} />,
	document.getElementById('root')
);

if (module.hot) {
	module.hot.accept(() => {
		// eslint-disable-next-line global-require
		const NextRoot = require('./components/Window/WindowFrame').default;
		render(
			<NextRoot store={store} />,
			document.getElementById('root')
		);
	});
}