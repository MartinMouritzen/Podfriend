import React, { Component } from 'react';

import { hot } from 'react-hot-loader/root';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import isElectron from 'is-electron';

import { MemoryRouter as Router } from 'react-router-dom';
// import { Router } from 'react-router-dom'; // We need to try more with this. Right now it doesn't work because the path is including D:/ etc. - But maybe we should always use memoryrouter in the SPA and browserrouter on the web?

// import { ConnectedRouter } from 'react-router-redux';

import PodCastClient from '~/app/components/PodCastClient';
import TitleBar from '~/app/components/Window/TitleBar';

import styles from '~/app/components/Window/WindowFrame.css';

/*
*
*/
class WindowFrame extends Component {
	constructor(props) {
		super(props);
		
		var isAppElectron = isElectron();
		
		if (isAppElectron) {
			this.remote = require('electron').remote;
			this.appWindow = this.remote.getCurrentWindow();
		}
		
		this.state = {
			isElectron: isAppElectron,
			maximized: false
		};
		
		this.onMinimize = this.onMinimize.bind(this);
		this.onMaximizeOrNormalize = this.onMaximizeOrNormalize.bind(this);
		this.onClose = this.onClose.bind(this);
	}
	/**
	*
	*/
	onMinimize() {
		if (this.state.isElectron) {
			this.appWindow.minimize();
			this.setState({
				maximized: false
			});
		}
	}
	/**
	*
	*/
	onMaximizeOrNormalize() {
		if (this.state.isElectron) {
			if (this.state.maximized) {
				this.appWindow.unmaximize();
				this.setState({
					maximized: false
				});
			}
			else {
				this.appWindow.maximize();
				this.setState({
					maximized: true
				});
			}
		}
	}
	/**
	*
	*/
	onClose() {
		if (this.state.isElectron) {
			this.appWindow.close();
		}
	}
	/**
	*
	*/
	componentDidMount() {
		if (this.state.isElectron) {
			this.appWindow.on('maximize',() => {
				console.log('MAXED');
				this.setState({
					maximized: true
				});
			});
			this.appWindow.on('unmaximize',() => {
				console.log('UNMAXED');
				this.setState({
					maximized: false
				});
			});
		}
	}
	render() {
		return (
			<Provider store={this.props.store}>
				<PersistGate loading={null} persistor={this.props.persistor}>
					<Router history={this.props.history}>
						<div className={this.state.maximized ? styles.windowFrameMaximized : styles.windowFrame }>
							<TitleBar isElectron={this.state.isElectron} maximized={this.state.maximized} onMinimize={this.onMinimize} onMaximizeOrNormalize={this.onMaximizeOrNormalize} onClose={this.onClose} platform={this.props.platform} />
							<PodCastClient store={this.props.store} />
						</div>
					</Router>
				</PersistGate>
			</Provider>
		);
	}
}
export default hot(WindowFrame);