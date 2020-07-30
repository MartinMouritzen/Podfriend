import React from 'react';
import { render } from 'react-dom';

import storage from 'redux-persist/lib/storage'

import configureStore from './redux/store'

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

/*
history.listen((location) => {
	console.log('Location changed. Hooray!');
	console.log(history);
	console.log(location);
});
*/

render(
	<WindowFrame store={store} persistor={persistor} platform={process.platform} history={history} />,
	document.getElementById('root')
);




if (module.hot) {
	module.hot.accept('./components/Window/WindowFrame',() => {
		// eslint-disable-next-line global-require
		const NextRoot = require('./components/Window/WindowFrame').default;
		render(
			<NextRoot store={store} persistor={persistor} history={history} platform={process.platform} />,
			document.getElementById('root')
		);
	});
}

/*
if (module.hot) {
  module.hot.accept("./app", () => {
    render(App);
  });
}

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default; // Get the updated code
    render(NextApp);
  });
}
*/