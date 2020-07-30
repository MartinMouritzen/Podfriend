import React from 'react';

import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import configureStore from 'podfriend-redux/store'
var [ store, persistor, history ] = configureStore(AsyncStorage,false);

import MobileClient from './components/MobileClient';

class App extends React.Component {
	constructor(props) {
		super(props);
		console.log('App constructor');
		this.state = {
			isReady: false,
		};
	}
	componentDidMount() {
		/*
		Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		})
		.then(() => {
			this.setState({ isReady: true });
		});
		*/
	}
	render() {
		/*
		if (!this.state.isReady) {
			return <AppLoading />;
		}
		*/
		return (
			<Provider store={store}>
				<MobileClient audioController={this.props.audioController} />
			</Provider>
		);
	}
}

export default App;