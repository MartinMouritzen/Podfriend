import React from 'react';

import { NativeRouter, Switch, Route, BackButton } from 'react-router-native';

import { StatusBar, View, ScrollView, SafeAreaView } from 'react-native';

import { StyleProvider, Container } from 'native-base';

import getTheme from './../native-base-theme/components';
import platformTheme from './../native-base-theme/variables/platform';

import MobileHeader from './Header/MobileHeader.jsx';


import Player from 'podfriend/Player.jsx';
// import MiniPlayerUI from './Player/MiniPlayerUI.jsx';
import MiniPlayerUI from './Player/MiniPlayerFullUI.jsx';

import Home from './Home/Home.jsx';

import MainDrawer from './Drawer/MainDrawer.jsx';

import Navigation from './Navigation/Navigation.jsx';

import PodcastTabs from './PodcastTabs/PodcastTabs.jsx';

import EpisodePane from 'podfriend/Episode/EpisodePane.jsx';

import SearchPane from 'podfriend/Search/SearchPane.jsx';
import SearchUI from './Search/SearchUI.jsx';

import PodcastPane from 'podfriend/Podcast/PodCastPane.jsx';
import PodcastPaneUI from './Podcast/PodcastPaneUI.jsx';

class MobileClient extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isDrawerOpen: false,
			scrollX: 0,
			scrollY: 0
		};
		
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.onContentScroll = this.onContentScroll.bind(this);
	}
	/**
	* this should move to redux
	*/
	openDrawer() {
		this.setState({
			isDrawerOpen: true
		});
	}
	/**
	* this should move to redux
	*/
	closeDrawer() {
		this.setState({
			isDrawerOpen: false
		});
	}
	/**
	* 
	*/
	onContentScroll(event) {
		this.setState({
			scrollY: event.nativeEvent.contentOffset.y
		});
	}
	/**
	*
	*/
	render() {
		return (
			<NativeRouter>
				<BackButton />
				<StyleProvider style={getTheme(platformTheme)}>
					<MainDrawer isOpen={this.state.isDrawerOpen}>
						<Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
							<MobileHeader scrollY={this.state.scrollY} onOpenDrawer={this.openDrawer} />
							<Switch>
								<Route exact path="/" render={(props) => { return (<Home {...props} onContentScroll={this.onContentScroll} />); }} />
								<Route path="/search/author/:author/:authorId" render={(props) => { return (<SearchPane searchType="author" {...props} UI={SearchUI} />); }} />
								<Route path="/search/:query?" render={(props) => { return (<SearchPane searchType="podcast" {...props} UI={SearchUI} />); }} />
								<Route path="/podcast/:podcastName/episode/:episode/" render={(props) => { return (<EpisodePane audioController={this.props.audioController} {...props} />); }} />
								<Route path="/podcast/:podcastName" render={(props) => { return (<PodcastPane {...props} UI={PodcastPaneUI} />); }} />
								<Route path="/podcasts/" render={(props) => { return (<PodcastTabs {...props} />); }} />
							</Switch>
							<Player audioController={this.props.audioController} UI={MiniPlayerUI} />
						</Container>
						<Navigation />
					</MainDrawer>

				</StyleProvider>
			</NativeRouter>
		);
	}
}

export default MobileClient;