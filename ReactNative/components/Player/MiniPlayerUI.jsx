import React from 'react';

import { TouchableHighlight, TouchableOpacity, Animated, View, StyleSheet, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { Link, withRouter, matchPath } from 'react-router-native';

import { Text, Icon, Button, Spinner } from 'native-base';

import ProgressBar from './ProgressBar.jsx';

import { Slider } from 'react-native-elements';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import platformTheme from '../../native-base-theme/variables/platform';

import FallbackImage from './../UI/Common/FallbackImage.jsx';

const playerHeightWhenShown = 50;

class PlayerUI extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			shouldShow: true,
			animating: false,
			heightAnimation: new Animated.Value(playerHeightWhenShown)
		};
		
		this.previousTime = 0;
		
		this.goToPodcast = this.goToPodcast.bind(this);
		this.goToEpisode = this.goToEpisode.bind(this);
		
		this.togglePlayerState = this.togglePlayerState.bind(this);
		this.togglePlaying = this.togglePlaying.bind(this);
		this.onPlayPausePress = this.onPlayPausePress.bind(this);
		
		this.props.audioController.onCanPlay = this.props.onCanPlay;
		this.props.audioController.onBuffering = this.props.onBuffering;
		this.props.audioController.onEnded = this.props.onEnded;
	}
	/**
	*
	*/
	componentDidMount() {
		var timerID = setInterval(() => {
			let currentTime = this.props.audioController.getCurrentTime();

			if (this.previousTime != currentTime) {
				this.previousTime = currentTime;

				this.props.onTimeUpdate();
			}
		},1000);
		
		this.setState({
			timerID: timerID
		});
	}
	/**
	*
	*/
	componentWillUnmount() {
		clearInterval(this.state.timerID);
	}
	/**
	*
	*/
	goToPodcast() {
		this.props.history.push({
			pathname: '/podcast/' + this.props.activePodcast.path,
			search: '?clickTime=' + new Date().getMilliseconds(),
			state: {
				podcast: this.props.activePodcast,
				fromPlayer: true
			}
		})
	}
	/**
	*
	*/
	goToEpisode() {
		this.props.history.push({
			pathname: '/podcast/' + this.props.activePodcast.path + '/episode/episode-url-here',
			search: '?clickTime=' + new Date().getMilliseconds(),
			state: {
				podcast: this.props.activePodcast,
				fromPlayer: true
			}
		})
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.location !== prevProps.location) {
			var matchResult = matchPath(this.props.location.pathname, { path: '/podcast/:podcastName/episode/:episode/' });
			if (matchResult && matchResult.isExact) {
				// We are looking at an episode. Time to remove this player.
				this.setState({
					shouldShow: false
				},() => {
					this.togglePlayerState(false);
				});
			}
			else {
				this.setState({
					shouldShow: true
				},() => {
					this.togglePlayerState(true);
				});
			}

		}
		// if (prevProps.shouldPlay != this.props.shouldPlay) {
			// this.togglePlaying(this.props.shouldPlay);
		// }
	}
	/**
	*
	*/
	togglePlayerState(shown) {
		if (this.state.animating) {
			Animated.timing(this.state.heightAnimation).stop();
		}
		this.setState({
			animating: true
		},() => {
			Animated.timing(this.state.heightAnimation, {
				toValue: (this.state.shouldShow ? playerHeightWhenShown : 0),
				duration: 500,
				useNativeDriver: false
			})
			.start((finished) => {
				this.setState({
					animating: false
				});
			});
		});
	}
	/**
	*
	*/
	togglePlaying(playing) {

	}
	/**
	*
	*/
	onPlayPausePress() {
		if (this.props.shouldPlay) {
			this.props.pause();
		}
		else if (!this.props.shouldPlay) {
			this.props.play();
		}
	}
	/**
	*
	*/
	render() {
		return (
			<View style={{ position: 'absolute', bottom: 50, zIndex: 10, flexDirection: 'row', width: '100%', backgroundColor: 'rgba(14,70,157,0.96)', height: 60 }}>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 9 }}>
						<TouchableHighlight onPress={this.goToEpisode} style={{ width: 36, height: 36, borderRadius: 5, overflow: 'hidden' }}>
							<FallbackImage seed={this.props.activePodcast ? this.props.activePodcast.name : ''} noImageNote={this.props.activePodcast ? this.props.activePodcast.name.substring(0,1) : ''} style={{ width: 36, height: 36 }} source={{ uri: this.props.activePodcast.artworkUrl100 }} />
						</TouchableHighlight>
					</View>
					<View style={{ flex: 1, marginLeft: 7, marginTop: 3 }}>
						<Text numberOfLines={1} style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' }}>
							{this.props.title}
						</Text>
						<Text numberOfLines={1} secondary style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', position: 'relative', bottom: 4 }}>
							{this.props.activePodcast.name}
						</Text>
					</View>
				</View>

				<View style={{ width: 80, alignItems: 'center' }}>
					<TouchableHighlight
						onPress={this.onPlayPausePress}
						underlayColor="#1180e7"
						style={{
							flex: 1,
							width: 62,
							height: 62,
							borderWidth: 4,
							borderColor: '#0176e5',
							borderRadius: 50,
							backgroundColor: '#0176e5',
							alignItems: 'center',
							justifyContent: 'center',
							shadowColor: "#000", 
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
							position: 'absolute',
							top: 10
						}}
					>
						<>
						{ this.props.isBuffering &&
							<Spinner color="#FFFFFF" size={'small'} />
						}
						{ this.props.shouldPlay && !this.props.isBuffering &&
							<Icon type="FontAwesome5" name="pause" style={{ color: '#FFFFFF', fontSize: 26, marginLeft: 1 }} />
						}
						{ !this.props.shouldPlay && !this.props.isBuffering &&
							<Icon type="FontAwesome5" name="play" style={{ color: '#FFFFFF', fontSize: 26, marginLeft: 4 }} />
						}
						</>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
}

export default withRouter(PlayerUI);