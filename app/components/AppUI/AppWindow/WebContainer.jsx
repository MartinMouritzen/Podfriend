import React, { useState } from 'react';

import { Provider } from 'react-redux';

import { hot } from 'react-hot-loader/root';

import { PersistGate } from 'redux-persist/integration/react';

import { BrowserRouter as BrowserRouter } from 'react-router-dom';
import { MemoryRouter as MemoryRouter } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

import { Capacitor } from '@capacitor/core'

// import { getPlatforms } from '@ionic/react';

// import { Router } from 'react-router-dom'; // We need to try more with this. Right now it doesn't work because the path is including D:/ etc. - But maybe we should always use memoryrouter in the SPA and browserrouter on the web?

// import { ConnectedRouter } from 'react-router-redux';

import { StatusBar } from '@ionic-native/status-bar/';


import PodCastClient from '~/app/components/PodCastClient';
import TitleBar from '~/app/components/AppUI/AppWindow/TitleBar';

import styles from '~/app/components/AppUI/AppWindow/AppWindow.scss';

// let Router = BrowserRouter;
// console.log(IonReactRouter);
let Router = IonReactRouter;

// var platforms = getPlatforms();

let appType = 'browser';
const mediaQueryStandAlone = '(display-mode: standalone)';
if (Capacitor.isNative || navigator.standalone || window.matchMedia(mediaQueryStandAlone).matches) {
	appType = 'standalone';
	// Router = MemoryRouter;
}

StatusBar.backgroundColorByHexString('#ffffff');
console.log(StatusBar);

/*
*
*/
const WebContainer = ({ store, history, persistor, audioController, platform}) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router>
					<div className={styles.webContainer + ' appType_' + appType}>
						<TitleBar appType={appType} isElectron={false} platform={platform} />
						<PodCastClient appType={appType} store={store} audioController={audioController} />
					</div>
				</Router>
			</PersistGate>
		</Provider>
	);
}
export default hot(WebContainer);