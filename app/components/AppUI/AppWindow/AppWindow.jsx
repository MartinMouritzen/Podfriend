import React, { useState, useEffect } from 'react';

import { Provider } from 'react-redux';

import { hot } from 'react-hot-loader/root';

import { PersistGate } from 'redux-persist/integration/react';

import isElectron from 'is-electron';
const { ipcRenderer } = require('electron');

import { MemoryRouter as Router } from 'react-router-dom';
// import { Router } from 'react-router-dom'; // We need to try more with this. Right now it doesn't work because the path is including D:/ etc. - But maybe we should always use memoryrouter in the SPA and browserrouter on the web?
// import { ConnectedRouter } from 'react-router-redux';

import PodCastClient from '~/app/components/PodCastClient';
import TitleBar from '~/app/components/AppUI/AppWindow/TitleBar';

import styles from '~/app/components/AppUI/AppWindow/AppWindow.scss';

const AppWindow = ({ store, history, persistor, audioController, platform}) => {
	const [isAppElectron,setIsAppElectron] = useState(false);
	const [remote,setRemote] = useState(false);
	const [appWindow,setAppWindow] = useState(false);
	const [maximized,setMaximized] = useState(false);

	useEffect(() => {
		setIsAppElectron(isElectron());
	},[]);

	useEffect(() => {
		if (isAppElectron) {
			var remote = require('electron').remote; // setRemote(require('electron').remote);

			var electronWindow = remote.getCurrentWindow();
			setAppWindow(electronWindow);

			electronWindow.on('maximize',() => {
				setMaximized(true);
			});
			electronWindow.on('unmaximize',() => {
				setMaximized(false);
			});
		}
	},[isAppElectron]);


	const onMinimize = () => {
		if (isAppElectron) {
			appWindow.minimize();
			setMaximized(false);
		}
	}
	const onMaximizeOrNormalize = () => {
		if (isAppElectron) {
			if (maximized) {
				appWindow.unmaximize();
				setMaximized(false);
			}
			else {
				appWindow.maximize();
				setMaximized(true);
			}
		}
	}
	const onClose = () => {
		if (isAppElectron) {
			appWindow.close();
		}
	}
	const onEpisodeChange = (activeEpisode) => {
		if (isAppElectron) {
			console.log('sending PFOnActivePodcastChange event');
			ipcRenderer.send('PFMessageToMiniWindow',{
				type: 'podcastChange',
				content: activeEpisode
			})
		}
	}

	const appType = 'desktop';

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router history={history}>
					<div className={maximized ? styles.windowFrameMaximized : styles.windowFrame  + ' appType_' + appType}>
						<TitleBar isElectron={isAppElectron} maximized={maximized} onMinimize={onMinimize} onMaximizeOrNormalize={onMaximizeOrNormalize} onClose={onClose} platform={platform} />
						<PodCastClient onEpisodeChange={onEpisodeChange} store={store} audioController={audioController} />
					</div>
				</Router>
			</PersistGate>
		</Provider>
	);
};
export default hot(AppWindow);