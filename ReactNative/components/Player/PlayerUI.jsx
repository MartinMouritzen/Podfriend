import React from 'react';

import { connect } from "react-redux";

import { TouchableHighlight, TouchableOpacity, Animated, View, StyleSheet, Image } from 'react-native';

import { Link, withRouter } from 'react-router-native';

import { Text, Icon, Button, Spinner } from 'native-base';

import { ProgressComponent } from 'react-native-track-player';

import ProgressBar from './ProgressBar.jsx';

import { Slider } from 'react-native-elements';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import platformTheme from './../../native-base-theme/variables/platform';

const styles = StyleSheet.create({
	sliderStyle: {
		height: 10,
		zIndex: 10
	},
	trackSliderStyle: {
		height: 5
	},
	trackSliderThumbStyle: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#CCCCCC',
		width: 20,
		height: 20,
		transform: [
			{
				translateY: -15
			}
		]
		
	}
});

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode
	};
}

const playerHeightWhenPlaying = 100;
const playerHeightWhenPaused = 51;

const extraPlayBarHeightWhenPlaying = 65;
const extraPlayBarHeightWhenPaused = 0;

const authorHeightWhenPlaying = 0;
const authorHeightWhenPaused = 20;

const playButtonContainerWidthWhenPlaying = 0;
const playButtonContainerWidthWhenPaused = 35;

const progressBarHeightWhenPlaying = 0;
const progressBarHeightWhenPaused = 3;

class PlayerUI extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			animating: false,
			heightAnimation: new Animated.Value((props.playing ? playerHeightWhenPlaying : playerHeightWhenPaused)),
			extraPlayBarHeightAnimation: new Animated.Value((props.playing ? extraPlayBarHeightWhenPlaying : extraPlayBarHeightWhenPaused)),
			authorHeightAnimation: new Animated.Value((props.playing ? authorHeightWhenPlaying : authorHeightWhenPaused)),
			playButtonContainerWidthAnimation: new Animated.Value((props.playing ? playButtonContainerWidthWhenPlaying : playButtonContainerWidthWhenPaused)),
			progressBarHeightAnimation: new Animated.Value((props.playing ? progressBarHeightWhenPlaying : progressBarHeightWhenPaused))
		};
		
		this.previousTime = 0;
		
		this.goToPodcast = this.goToPodcast.bind(this);
		this.togglePlaying = this.togglePlaying.bind(this);
		
		this.props.audioController.onCanPlay = this.props.onCanPlay;
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
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.playing != this.props.playing) {
			this.togglePlaying(this.props.playing);
		}
	}
	/**
	*
	*/
	togglePlaying(playing) {
		if (this.state.animating) {
			Animated.timing(this.state.heightAnimation).stop();
			// Animated.timing(this.state.authorHeightAnimation).stop();
			// Animated.timing(this.state.extraPlayBarHeightAnimation).stop();
		}
		
		this.setState({
			animating: true
		},() => {
			Animated.parallel([
				Animated.timing(this.state.heightAnimation, {
					toValue: (playing ? playerHeightWhenPlaying : playerHeightWhenPaused),
					duration: 500,
					useNativeDriver: false
				}),
				Animated.timing(this.state.authorHeightAnimation, {
					toValue: (playing ? authorHeightWhenPlaying : authorHeightWhenPaused),
					duration: 500,
					useNativeDriver: false
				}),
				Animated.timing(this.state.extraPlayBarHeightAnimation, {
					toValue: (playing ? extraPlayBarHeightWhenPlaying : extraPlayBarHeightWhenPaused),
					duration: 500,
					useNativeDriver: false
				}),
				Animated.timing(this.state.playButtonContainerWidthAnimation, {
					toValue: (playing ? playButtonContainerWidthWhenPlaying : playButtonContainerWidthWhenPaused),
					duration: 500,
					useNativeDriver: false
				}),
				Animated.timing(this.state.progressBarHeightAnimation, {
					toValue: (playing ? progressBarHeightWhenPlaying : progressBarHeightWhenPaused),
					duration: 500,
					useNativeDriver: false
				})
			]).start((finished) => {
				this.setState({
					animating: false
				});
			});
		});
	}
	/**
	*
	*/
	render() {
		var sliderValue = Math.round((100 * this.props.progress) / this.props.duration);
		
		if (isNaN(sliderValue)) {
			sliderValue = 0;
		}
		
		return (
			<Animated.View style={{ position: 'relative', overflow: 'hidden', height: this.state.heightAnimation, backgroundColor: '#eeeeee' }}>
				<View style={{height: 2, backgroundColor: '#cccccc' }} />
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TouchableHighlight onPress={this.goToPodcast}>
						<Animated.Image style={{ width: this.state.heightAnimation, height: this.state.heightAnimation }} source={{ uri: this.props.activePodcast.artworkUrl100 }} />
					</TouchableHighlight>
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<View style={{ flex: 1, marginLeft: 7, marginTop: 3 }}>
								<Text numberOfLines={1} style={{ fontSize: 16 }}>
									{this.props.title}
								</Text>
								<Animated.View style={{ height: this.state.authorHeightAnimation, overflow: 'hidden' }}>
									<Text numberOfLines={1} secondary style={{ fontSize: 14 }}>
										{this.props.activePodcast.author}
									</Text>
								</Animated.View>
							</View>
						</View>
						<Animated.View style={{ height: this.state.extraPlayBarHeightAnimation, overflow: 'hidden' }}>
							<View style={{ width: '100%', height: 10 }}>
								<Slider
									style={{ width: 295, height: 10, marginLeft: 8 }}
									
									value={sliderValue}
									minimumValue={0}
									maximumValue={100}
									minimumTrackTintColor="#28bd72"
									maximumTrackTintColor="#575757"
									thumbTintColor="#FFFFFF"
									onValueChange={this.props.onProgressSliderChange}
									trackStyle={styles.trackSliderStyle}
									thumbStyle={styles.trackSliderThumbStyle}
								/>
							</View>
							<View style={{ flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', marginTop: 6 }}>
								<View style={{ flex: 1, flexDirection: 'row', height: '100%', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 10 }}>
									<Text secondary style={{ fontSize: 12 }}>
										{TimeUtil.formatPrettyDurationText(this.props.progress)}
									</Text>
								</View>
								<TouchableOpacity onPress={this.props.onPrevEpisode}>
									<Icon type="FontAwesome5" name="fast-backward" style={{ color: '#999999', marginRight: 14, fontSize: 22 }} />
								</TouchableOpacity>
							
								<TouchableOpacity onPress={this.props.onBackward}>
									<Icon type="FontAwesome5" name="backward" style={{ color: '#999999', marginRight: 14, fontSize: 22 }}  />
								</TouchableOpacity>
									
								<TouchableOpacity
									onPress={this.props.pause}
									style={{
										alignItems:'center',
										justifyContent:'center',
										width: 40,
										height: 40,
										backgroundColor: platformTheme.brandPrimary,
										borderRadius:50,
										marginRight: 14
									}}
								>
									<Icon type="FontAwesome5" name="pause" style={{ color: '#FFFFFF', fontSize: 14 }}  />
								</TouchableOpacity>
									
								<TouchableOpacity onPress={this.props.onForward}>
									<Icon type="FontAwesome5" name="forward" style={{ color: '#999999', marginRight: 14, fontSize: 22 }}  />
								</TouchableOpacity>
								
								<TouchableOpacity onPress={this.props.onNextEpisode}>
									<Icon type="FontAwesome5" name="fast-forward" style={{ color: '#999999', fontSize: 22 }}  />
								</TouchableOpacity>
								
								<View style={{ flex: 1, flexDirection: 'row', height: '100%', justifyContent: 'flex-end', alignItems: 'center', marginRight: 10 }}>
									<Text secondary style={{ fontSize: 12 }}>
										{TimeUtil.formatPrettyDurationText(this.props.duration)}
									</Text>
								</View>
							</View>
						</Animated.View>
					</View>
					<Animated.View style={{ width: this.state.playButtonContainerWidthAnimation, justifyContent: 'center' }}>
						{ !this.props.canPlay &&
							<TouchableOpacity onPress={this.props.pause}>
								<Spinner color="#0176e5" />
							</TouchableOpacity>
						}
						{ this.props.canPlay &&
							<TouchableOpacity onPress={this.props.play}>
								<Icon type="FontAwesome" name="play" style={{ color: platformTheme.brandPrimary, fontSize: 24 }} />
							</TouchableOpacity>
						}
					</Animated.View>
				</View>
				<Animated.View style={{height: this.state.progressBarHeightAnimation, overflow: 'hidden' }}>
					<ProgressBar />
				</Animated.View>
			</Animated.View>
		);
	}
}

const ConnectedPlayerUI = withRouter(connect(
	mapStateToProps,
	null
)(PlayerUI));

export default ConnectedPlayerUI;