import React, { Component } from 'react';

import { Provider } from 'react-redux';

import { hot } from 'react-hot-loader/root';

import { PersistGate } from 'redux-persist/integration/react';

import isElectron from 'is-electron';

import { BrowserRouter as Router } from 'react-router-dom';
// import { Router } from 'react-router-dom'; // We need to try more with this. Right now it doesn't work because the path is including D:/ etc. - But maybe we should always use memoryrouter in the SPA and browserrouter on the web?

// import { ConnectedRouter } from 'react-router-redux';

import PodCastClient from '~/app/components/PodCastClient';
import TitleBar from '~/app/components/Window/TitleBar';

import styles from '~/app/components/Window/WindowFrame.css';

/*
*
*/
class WebContainer extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Provider store={this.props.store}>
				<PersistGate loading={null} persistor={this.props.persistor}>
					<Router history={this.props.history}>
						<div className={styles.webContainer}>
							<TitleBar isElectron={false} platform={this.props.platform} />
							<PodCastClient store={this.props.store} audioController={this.props.audioController} />
						</div>
					</Router>
				</PersistGate>
			</Provider>
		);
	}
}
export default hot(WebContainer);