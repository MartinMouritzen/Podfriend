import React from 'react';

import { connect } from "react-redux";

import { TouchableHighlight, TouchableOpacity, Animated, View, StyleSheet, Image } from 'react-native';

import { audioPlayRequested, audioCanPlay, audioBuffering, audioPlaying, audioPaused } from "podfriend-redux/actions/audioActions";

import { Link, withRouter } from 'react-router-native';

import { Text, Icon, Button, Spinner } from 'native-base';

import { Slider } from 'react-native-elements';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import Events from 'podfriend-approot/library/Events.js';

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

class EpisodePlayer extends React.Component {
	constructor(props) {
		super(props);
		
		this.onPlayPausePress = this.onPlayPausePress.bind(this);
	}
	/**
	*
	*/
	onPlayPausePress() {
		Events.emit('MediaPlayPause');
	}
	/**
	*
	*/
	render() {
		var sliderValue = Math.round((100 * this.props.activeEpisode.currentTime) / this.props.activeEpisode.duration);
		
		if (isNaN(sliderValue)) {
			sliderValue = 0;
		}
		
		return (
			<View style={{ flex: 1, flexDirection: 'row' }}>
				<View style={{ flex: 1 }}>
					<View style={{ height: 100 }}>
						<View style={{ width: '100%', height: 10 }}>
							<Slider
								style={{ width: 295, height: 10, marginLeft: 8 }}
								
								value={sliderValue}
								minimumValue={0}
								maximumValue={100}
								minimumTrackTintColor="#28bd72"
								maximumTrackTintColor="#0b1928"
								thumbTintColor="#FFFFFF"
								onValueChange={this.props.onProgressSliderChange}
								trackStyle={styles.trackSliderStyle}
								thumbStyle={styles.trackSliderThumbStyle}
							/>
						</View>
						<View style={{ flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', marginTop: 6 }}>
							<View style={{ flex: 1, flexDirection: 'row', height: '100%', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 10 }}>
								<Text secondary style={{ fontSize: 12, color: '#ccd9e5' }}>
									{TimeUtil.formatPrettyDurationText(this.props.activeEpisode.currentTime)}
								</Text>
							</View>
							<TouchableOpacity onPress={this.props.onPrevEpisode}>
								<Icon type="FontAwesome5" name="fast-backward" style={{ color: '#ccd9e5', marginRight: 14, fontSize: 22 }} />
							</TouchableOpacity>
						
							<TouchableOpacity onPress={this.props.onBackward}>
								<Icon type="FontAwesome5" name="backward" style={{ color: '#ccd9e5', marginRight: 14, fontSize: 22 }}  />
							</TouchableOpacity>
							
							
							<TouchableOpacity onPress={this.onPlayPausePress}>
								{ this.props.isBuffering &&
									<Spinner color="#FFFFFF" size={'small'} />
								}
								{ this.props.shouldPlay && !this.props.isBuffering &&
									<Icon type="FontAwesome5" name="pause" style={{ color: '#FFFFFF', fontSize: 26, marginLeft: 1 }} />
								}
								{ !this.props.shouldPlay && !this.props.isBuffering &&
									<Icon type="FontAwesome5" name="play" style={{ color: '#FFFFFF', fontSize: 26, marginLeft: 4 }} />
								}
							</TouchableOpacity>
								
							<TouchableOpacity onPress={this.props.onForward}>
								<Icon type="FontAwesome5" name="forward" style={{ color: '#ccd9e5', marginRight: 14, fontSize: 22 }}  />
							</TouchableOpacity>
							
							<TouchableOpacity onPress={this.props.onNextEpisode}>
								<Icon type="FontAwesome5" name="fast-forward" style={{ color: '#ccd9e5', fontSize: 22 }}  />
							</TouchableOpacity>
							
							<View style={{ flex: 1, flexDirection: 'row', height: '100%', justifyContent: 'flex-end', alignItems: 'center', marginRight: 10 }}>
								<Text secondary style={{ fontSize: 12, color: '#ccd9e5' }}>
									{TimeUtil.formatPrettyDurationText(this.props.activeEpisode.duration)}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode,
		shouldPlay: state.audio.shouldPlay,
		isPlaying: state.audio.isPlaying,
		canPlay: state.audio.canPlay,
		isBuffering: state.audio.isBuffering
	};
}
function mapDispatchToProps(dispatch) {
	return {
		audioPlaying: () => { dispatch(audioPlaying()); },
		audioPaused: () => { dispatch(audioPaused()); },
		audioPlayRequested: () => { dispatch(audioPlayRequested()); }
	};
}

const ConnectedEpisodePlayer = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(EpisodePlayer));

export default ConnectedEpisodePlayer;