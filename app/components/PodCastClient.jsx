import React, { Component, Suspense, lazy } from 'react';

import { connect } from "react-redux";
import { authenticateUser } from "../redux/actions/userActions";
import { abortLogin, hideSpeedSettingWindow, hideShareWindow, synchronizePodcasts } from 'podfriend-approot/redux/actions/uiActions';

import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import styles from './PodCastClient.scss';

import PodcastWallet from './../library/PodcastWallet/PodcastWallet.js';
import PodCastService from './../library/PodCastService.js';
import SideBar from './UI/SideBar';

// import SearchPane from './Search/SearchPane';
// import SearchPaneUI from './Search/SearchPaneUI.jsx';
const SearchPane = lazy(() => import('./Search/SearchPane'));
const SearchPaneUI = lazy(() => import('./Search/SearchPaneUI.jsx'));

// import PodCastPane from './Podcast/PodCastPane.jsx';
// import PodcastPaneUI from './Podcast/PodcastPaneUI.jsx';
const PodCastPane = lazy(() => import('./Podcast/PodCastPane.jsx'));
const PodcastPaneUI = lazy(() => import('./Podcast/PodcastPaneUI.jsx'));

import Player from './Player/Player.jsx';
import PlayerUI from './Player/PlayerUI.jsx';

import Welcome from './Welcome.jsx';

import FeedPage from 'podfriend-approot/components/Pages/FeedPage.jsx';

// import SettingsPage from '~/app/components/user/SettingsPage';
const SettingsPage = lazy(() => import('~/app/components/user/SettingsPage'));

import EpisodePane from 'podfriend-approot/components/Episode/EpisodePane';
// import ForPodcasters from 'podfriend-approot/components/Pages/ForPodcasters.jsx';
const ForPodcasters = lazy(() => import('podfriend-approot/components/Pages/ForPodcasters.jsx'));
const ContactPage = lazy(() => import('podfriend-approot/components/Pages/ContactPage.jsx'));

import BottomNavigation from 'podfriend-approot/components/Navigation/BottomNavigation';

import Events from './../library/Events.js';
import Modal from './Window/Modal';
import LoginForm from './Login/LoginForm';

import FavoriteList from './Favorites/FavoriteList.jsx';
import FavoriteListUI from './Favorites/FavoriteListUI.jsx';

// import SwipeExplorer from './Explore/SwipeExplorer.jsx';
const SwipeExplorer = lazy(() => import('./Explore/SwipeExplorer.jsx'));

import ShareModal from 'podfriend-approot/components/Player/ShareModal.jsx';
import AudioSpeedSettingModal from 'podfriend-approot/components/Player/AudioSpeedSettingModal.jsx';

import PageError from 'podfriend-approot/components/Error/PageError.jsx';

import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import {setupConfig} from '@ionic/react'

setupConfig({mode: 'ios'})

// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

/* Basic CSS for apps built with Ionic */
// import '@ionic/react/css/normalize.css';
// import '@ionic/react/css/structure.css';
// import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
// import '@ionic/react/css/padding.css';
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';


const mapStateToProps = state => ({
	showLogin: state.ui.showLogin,
	activeEpisode: state.podcast.activeEpisode,
	authToken: state.user.authToken,
	speedSettingWindowVisible: state.ui.showSpeedSettingWindow,
	showShareWindow: state.ui.showShareWindow,
	isLoggedIn: state.user.isLoggedIn,
	syncHappening: state.ui.syncHappening,
	syncedPodcastsThisSession: state.ui.syncedPodcastsThisSession,
	syncLastDate: state.ui.syncLastDate
})
const mapDispatchToProps = dispatch => ({
	authenticateUser: () => dispatch(authenticateUser()),
	abortLogin: () => dispatch(abortLogin()),
	hideSpeedSettingWindow: () => dispatch(hideSpeedSettingWindow()),
	hideShareWindow: () => dispatch(hideShareWindow()),
	synchronizePodcasts: () => dispatch(synchronizePodcasts())
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

		var podcastWallet = new PodcastWallet();
		
		this.onSearch = this.onSearch.bind(this);
		
		this.scrollTo = this.scrollTo.bind(this);
		// this.onMainAreaScroll = this.onMainAreaScroll.bind(this);
		this.checkMouseNavigation = this.checkMouseNavigation.bind(this);
		
		this.mainArea = React.createRef();
		
		this.state = {
			services: services,
			podcastWallet: podcastWallet
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
			this.props.history.goBack();
		},'PodcastClient');
		
		Events.addListener('OnNavigateForward',() => {
			this.props.history.goForward();
		},'PodcastClient');
		
		document.addEventListener('mouseup',this.checkMouseNavigation);
	}
	checkMouseNavigation(event) {
		if (event.button === 3) {
			this.props.history.goBack();
		}
		else if (event.button === 4) {
			this.props.history.goForward();
		}
		event.stopPropagation();
		event.preventDefault();
		return false;
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		// Send update to miniwindow with new episode data - Should this be moved to a separate file?
		if (this.props.activeEpisode.url !== prevProps.activeEpisode.url) {
			if (this.props.onEpisodeChange) {
				this.props.onEpisodeChange(this.props.activeEpisode);
			}
		}
		if (this.props.isLoggedIn) {
			if (this.props.syncHappening === false) {
				if (this.props.syncedPodcastsThisSession === false) {
					this.props.synchronizePodcasts();
				}
				//
				// syncedPodcastsThisSession: state.ui.syncedPodcastsThisSession,
				// syncLastDate:
			}
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
					else if (this.props.location.state && this.props.location.state.preventScroll) {

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
		document.removeEventListener('mouseup',this.checkMouseNavigation);
		Events.removeListenersInGroup('PodcastClient');
		// this.props.audioController.destroy();
	}
	/**
	*
	*/
	scrollTo(pixels) {
		// console.log('podcastclient.scrollTo: please scroll to: ' + pixels + ' thanks');
		if (this.mainArea && this.mainArea.current) {
			this.mainArea.current.scrollTop = pixels;
		}
	}
	/**
	*
	*/
	/*
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
	*/
	/**
	*
	*/
	render() {
		return (
			<div className={[styles.podCastClient,'themeLight'].join(' ')} onScroll={this.onScroll}>
				<div className={styles.top}>
					<SideBar />
					<div id="mainArea" onScroll={this.props.onScroll} className={styles.mainArea} ref={this.mainArea}>
						<PageError>
							<Suspense fallback={<div>Loading...</div>}>
								<Switch>
									<Route exact path="/" render={(props) => { return (<Welcome {...props} />); }} />
									<Route path="/search/author/:author/:authorId?" render={(props) => { return (<SearchPane searchType="author" {...props} UI={SearchPaneUI} />); }} />
									<Route path="/search/:query?" render={(props) => { return (<SearchPane searchType="podcast" {...props} UI={SearchPaneUI} />); }} />
									<Route path="/podfrndr/" render={(props) => { return (<SwipeExplorer {...props} />); }} />
									<Route exact path="/podcast/:podcastName/" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
									<Route exact path="/podcast/:podcastName/reviews/" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
									<Route exact path="/podcast/:podcastName/community/" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
									<Route exact path="/podcast/:podcastName/lists/" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
									<Route exact path="/podcast/:podcastName/creators-and-guests/" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
									<Route exact path="/podcast/:podcastName/extraContent/" render={(props) => { return (<PodCastPane {...props} scrollTo={this.scrollTo} UI={PodcastPaneUI} />); }} />
									<Route exact path="/podcast/:podcastName/:episodeId" render={(props) => { return (<EpisodePane {...props} />); }} />
									<Route exact path="/podcast/:podcastName/:episodeId/chapters/" render={(props) => { return (<EpisodePane {...props} />); }} />
									<Route exact path="/podcast/:podcastName/:episodeId/chat/" render={(props) => { return (<EpisodePane {...props} />); }} />
									<Route path="/settings/" render={(props) => { return (<SettingsPage />); }} />
									<Route path="/podcasters/" render={(props) => { return (<ForPodcasters />); }} />
									<Route path="/contact/" render={(props) => { return (<ContactPage />); }} />
									<Route path="/favorites/" render={(props) => { return ( <FavoriteList UI={FavoriteListUI} showResponsiveList={true} showArchived={false} setHasArchived={false} /> ); }} />
									<Redirect to='/' />
								</Switch>
							</Suspense>
						</PageError>
					</div>
				</div>
				<Player audioController={this.props.audioController} onEpisodeSelect={this.onEpisodeSelect} UI={PlayerUI} />
				<BottomNavigation />
				{ this.props.showLogin &&
					<Modal onClose={this.props.abortLogin}>
						<LoginForm />
					</Modal>
				}
				{ false &&
					<BottomSheet
						open={(this.props.showLogin === true)}
						onDismiss={(this.props.abortLogin)}
					>
						<LoginForm />
					</BottomSheet>
				}
				{ this.props.speedSettingWindowVisible && 
					<AudioSpeedSettingModal onClose={this.props.hideSpeedSettingWindow} />
				}
				{ this.props.showShareWindow && 
					<ShareModal onClose={this.props.hideShareWindow} />
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