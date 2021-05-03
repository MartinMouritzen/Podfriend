import React, { useState } from 'react';

import { Provider } from 'react-redux';

import { hot } from 'react-hot-loader/root';

import { PersistGate } from 'redux-persist/integration/react';

import isElectron from 'is-electron';

import { BrowserRouter as BrowserRouter } from 'react-router-dom';
import { MemoryRouter as MemoryRouter } from 'react-router-dom';

import { Capacitor } from '@capacitor/core'

// import { getPlatforms } from '@ionic/react';

// import { Router } from 'react-router-dom'; // We need to try more with this. Right now it doesn't work because the path is including D:/ etc. - But maybe we should always use memoryrouter in the SPA and browserrouter on the web?

// import { ConnectedRouter } from 'react-router-redux';

import PodCastClient from '~/app/components/PodCastClient';
import TitleBar from '~/app/components/Window/TitleBar';

import styles from '~/app/components/Window/WindowFrame.css';

let Router = BrowserRouter;

// var platforms = getPlatforms();

let appType = 'browser';
const mediaQueryStandAlone = '(display-mode: standalone)';
if (Capacitor.isNative || navigator.standalone || window.matchMedia(mediaQueryStandAlone).matches) {
	appType = 'standalone';
	Router = MemoryRouter;
}
/*
*
*/
class WebContainer extends React.Component {
	/*
	constructor(props) {
		super(props);

		this.state = {
			lastScrollDirection: false,
			mainScrollPositionY: 0
		};

		this.onScroll = this.onScroll.bind(this);
	}
	onScroll(event) {
		var mainArea = event.target;

		var direction = mainArea.scrollTop > this.state.mainScrollPositionY ? 'down' : 'up';

		this.setState({
			lastScrollDirection: direction,
			mainScrollPositionY: mainArea.scrollTop
		});
	}
	*/
	render() {
		return (
			<Provider store={this.props.store}>
				<PersistGate loading={null} persistor={this.props.persistor}>
					<Router history={this.props.history}>
						<div className={styles.webContainer + ' appType_' + appType}>
							<TitleBar appType={appType} isElectron={false} platform={this.props.platform} />
							<PodCastClient appType={appType} store={this.props.store} audioController={this.props.audioController} />
						</div>
					</Router>
				</PersistGate>
			</Provider>
		);
	}
}
export default hot(WebContainer);