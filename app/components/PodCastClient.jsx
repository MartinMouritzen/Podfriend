import React, { Component } from 'react';

import { connect } from "react-redux";
import { authenticateUser, abortLogin } from "../redux/actions/userActions";

const { ipcRenderer } = require('electron')

import { Route, Link, Switch, withRouter } from 'react-router-dom';

import styles from './PodCastClient.scss';

import PodCastService from './../library/PodCastService.js';
import SideBar from './SideBar';

import SearchPane from './Search/SearchPane';
import SearchPaneUI from './Search/SearchPaneUI.jsx';

import PodCastPane from './Podcast/PodCastPane.jsx';
import PodcastPaneUI from './Podcast/PodcastPaneUI.jsx';

import Player from './Player';
import PlayerUI from './Player/PlayerUI.jsx';

import Welcome from './Welcome';
import SettingsPage from '~/app/components/user/SettingsPage';

import BottomNavigation from './BottomNavigation';

import Events from './../library/Events.js';
import Modal from './Window/Modal';
import LoginForm from './Login/LoginForm';

const mapStateToProps = state => ({
	showLogin: state.user.showLogin,
	activeEpisode: state.podcast.activeEpisode,
	authToken: state.user.authToken
})
const mapDispatchToProps = dispatch => ({
	authenticateUser: () => dispatch(authenticateUser()),
	abortLogin: () => dispatch(abortLogin())
})

/**
*
*/
class PodcastClient extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		var services = {};
		services['itunes'] = new PodCastService('ITunes',window.podfriend.config.proxyPodcastVendorRequests,window.podfriend.config.api);
		// services['spotify'] = new PodCastService('Spotify');
		
		this.onSearch = this.onSearch.bind(this);
		
		this.scrollTo = this.scrollTo.bind(this);
		this.onMainAreaScroll = this.onMainAreaScroll.bind(this);
		
		
		this.mainArea = React.createRef();
		
		this.state = {
			services: services
		}
	}
	/**
	*
	*/
	componentDidMount() {
		if (this.props.authToken) {
			this.props.authenticateUser();
		}
		
		Events.addListener('OnSearch',this.onSearch,'PodcastClient');

		Events.addListener('OnEpisodePlaying',(data) => {
			
			var currentTime = data.episode.progress ? data.episode.progress : 0;
			if (currentTime > data.episode.duration - 5) {
				currentTime = 0;
			}
			
			var newPlayingState = {
				playing: true,
				podcast: data.podcast,
				episode: data.episode,
				episodeIndex: data.episodeIndex,
				episodeList: data.episodeList,
				currentTime: currentTime
			};
		},'PodcastClient');
		
		Events.addListener('OnNavigateBackward',() => {
			console.log(this.props.history);
			this.props.history.goBack();
		},'PodcastClient');
		
		Events.addListener('OnNavigateForward',() => {
			this.props.history.goForward();
		},'PodcastClient');
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		// Send update to miniwindow with new episode data - Should this be moved to a separate file?
		if (this.props.activeEpisode.url !== prevProps.activeEpisode.url) {
			console.log('sending PFOnActivePodcastChange event');
			ipcRenderer.send('PFMessageToMiniWindow',{
				type: 'podcastChange',
				content: this.props.activeEpisode
			})
		}
		if (this.props.location.pathname !== prevProps.location.pathname) {
			if (this.mainArea && this.mainArea.current) {
				if (false && this.props.location.state && Number.isInteger(this.props.location.state.mainScrollPosition)) {
					
					// Weird bug here
					
					// console.log(this.mainArea.current.scrollTop);
					// console.log('yay: ' + this.props.location.state.mainScrollPosition);
					this.mainArea.current.scrollTop = this.props.location.state.mainScrollPosition;
					// console.log(this.mainArea.current.scrollTop);
				}
				else {
					if (this.props.location.state && this.props.location.state.fromPlayer) {
						// console.log('nope from player, no scroll');
					}
					else {
						// console.log(this.mainArea.current.scrollTop);
						this.mainArea.current.scrollTop = 0;
					}
				}
			}
		}
	}
	/**
	*
	*/
	componentWillUnmount() {
		Events.removeListenersInGroup('PodcastClient');
		// this.props.audioController.destroy();
	}
	/**
	*
	*/
	scrollTo(pixels) {
		// console.log('please scroll to: ' + pixels + ' thanks');
		if (this.mainArea && this.mainArea.current) {
			this.mainArea.current.scrollTop = pixels;
		}
	}
	/**
	*
	*/
	onMainAreaScroll(event) {
		if (this.mainArea && this.mainArea.current) {
			var currentState = this.props.location.state;
			currentState = {
				...currentState,
				mainScrollPosition: this.mainArea.current.scrollTop
			};
			this.props.location.state = currentState;
		}
	}
	/**
	*
	*/
	render() {
		return (
			<div className={[styles.podCastClient,'themeLight'].join(' ')} onScroll={this.onScroll}>
				<div className={styles.top}>
					<SideBar />
					<div id="mainArea" onScroll={this.onMainAreaScroll} className={styles.mainArea} ref={this.mainArea}>
						<Switch>
							<Route exact path="/" render={(props) => { return (<Welcome {...props} />); }} />
							<Route path="/search/author/:author/:authorId" render={(props) => { return (<SearchPane searchType="author" {...props} UI={SearchPaneUI} />); }} />
							<Route path="/search/:query?" render={(props) => { return (<SearchPane searchType="podcast" {...props} UI={SearchPaneUI} />); }} />
							<Route path="/podcast/:podcastName" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
							<Route path="/settings/" render={(props) => { return (<SettingsPage />); }} />
						</Switch>
					</div>
				</div>
				<Player audioController={this.props.audioController} onEpisodeSelect={this.onEpisodeSelect} UI={PlayerUI} />
				<BottomNavigation />
				{ this.props.showLogin &&
					<Modal onClose={this.props.abortLogin}>
						<LoginForm />
					</Modal>
				}
			</div>
		);
	}
	/**
	*
	*/
	getServiceForProvider(provider) {
		provider = 'itunes';
		return this.state.services[provider];
	}
	/**
	*
	*/
	onSearch(query) {
		this.props.history.push({
			pathname: '/search/' + query
		});
	}
}

const ConnectedPodcastClient = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(PodcastClient));

export default ConnectedPodcastClient;