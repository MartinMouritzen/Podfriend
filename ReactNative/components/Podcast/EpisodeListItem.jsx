import React, { Component } from 'react';

import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, Button } from 'native-base';

import { format, distanceInWordsToNow } from 'date-fns';
import sanitizeHtml from 'sanitize-html';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import ListenedImage from 'podfriend-approot/images/listened2.png';

const md5 = require('md5');

import platformTheme from './../../native-base-theme/variables/platform';

/**
*
*/
class EpisodeListItem extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		var episodeTitle = sanitizeHtml(props.title,{
			allowedTags: []
		});
		
		// Decode entities, so that text with double encodings (eg. if it contained HTML when served to itunes, and they already encoded it) won't have encoded tags in it, when we parse it
		var description = sanitizeHtml(props.description,{
			allowedTags: ['i','em']
		});
		
		
		var urlmd5 = md5(props.url);
		
		this.state = {
			episodeTitle: episodeTitle,
			description: description,
			urlmd5: urlmd5
		};
		
		this.selectEpisode = this.selectEpisode.bind(this);
	}
	selectEpisode() {
		this.props.selectEpisode(this.props.episode);
	}
	shouldComponentUpdate(nextProps) {
		if (nextProps.title != this.props.title) { return true; }
		if (nextProps.description != this.props.description) { return true; }
		if (nextProps.url != this.props.url) { return true; }
		if (nextProps.currentTime != this.props.currentTime) { return true; }
		if (nextProps.duration != this.props.duration) { return true; }
		if (nextProps.listened != this.props.listened) { return true; }
		if (nextProps.isActiveEpisode != this.props.isActiveEpisode) { return true; }
		if (this.props.isActiveEpisode && nextProps.isPlaying != this.props.isPlaying) { return true; }
		
		return false;
	}
	render() {
		var progressPercentage = this.props.currentTime ? (100 * this.props.currentTime) / this.props.duration : 0;
		if (progressPercentage > 100) {
			progressPercentage = 100;
		}
		
		var totalMinutes = Math.round(this.props.duration / 60);
		var minutesLeft = this.props.currentTime ? Math.round((this.props.duration - this.props.currentTime) / 60) : totalMinutes;
		
		var playButtonBackgroundColor = '#FFFFFF';
		var playButtonIconName = 'play';
		var playButtonIconColor = platformTheme.brandPrimary;
		var playButtonIconSize = 24;
		var playButtonSize = 40;
		var playButtonMarginLeft = 6;
		var playButtonMarginTop = 0;
		
		if (this.props.isActiveEpisode && this.props.isPlaying) {
			playButtonIconColor = '#FFFFFF';
			playButtonBackgroundColor = platformTheme.brandPrimary;
			playButtonIconSize = 16;
			playButtonSize = 30;
			playButtonMarginLeft = 10;
			playButtonMarginTop = 5;
		}
		if (this.props.listened) {
			playButtonIconName = 'check';
			playButtonBackgroundColor = '#5cb85c';
			playButtonIconColor = '#FFFFFF';
			playButtonIconSize = 16;
			playButtonSize = 30;
			playButtonMarginLeft = 10;
			playButtonMarginTop = 5;
		}

		if (this.props.isActiveEpisode && this.props.isPlaying) {
			playButtonIconName = 'pause';
		}
		
		let headerStyle = {
			fontWeight: 'bold'
		}
		let textStyle = {
			
		};
		let minuteTextStyle = {
			fontSize: 12
		}
		let episodeStyle = {
		    borderBottomColor: '#EEEEEE',
		    borderBottomWidth: 1,
		    marginTop: 0,
		    paddingTop: 10,
		    paddingBottom: 5
		};
		
		let progressBarBackgroundColor = '#cccccc';
		let progressBarFillColor = platformTheme.brandPrimary;
		
		if (this.props.isActiveEpisode) {
			episodeStyle.backgroundColor = platformTheme.brandPrimary;
			// episodeStyle.borderRadius = 10;

			textStyle.color = '#FFFFFF';

			headerStyle.color = '#FFFFFF';
			
			minuteTextStyle.color = '#FFFFFF';
			
			progressBarBackgroundColor = '#FFFFFF';
			progressBarFillColor = platformTheme.brandSuccess;
		}
		
		return (
			<View id={'episode_' + this.state.urlmd5} style={episodeStyle}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ width: 50 }}>
						<TouchableOpacity
							onPress={this.selectEpisode}
							style={{
								alignItems:'center',
								justifyContent:'center',
								width: playButtonSize,
								height: playButtonSize,
								backgroundColor: playButtonBackgroundColor,
								borderRadius:50,
								marginLeft: playButtonMarginLeft,
								marginTop: playButtonMarginTop
							}}
						>
							<Icon type="FontAwesome" name={playButtonIconName} style={{ fontSize: playButtonIconSize, color: playButtonIconColor}} />
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, margin: 10, marginRight: 20 }}>
						<Text header style={headerStyle}>{this.state.episodeTitle}</Text>
						<Text secondary numberOfLines={2} style={textStyle}>{this.state.description}</Text>
						
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 10, overflow: 'hidden' }}>
							<View style={{ height: 10, width: 100, backgroundColor: progressBarBackgroundColor, marginRight: 10 }}>
								<View style={{ height: 10, width: Math.round(progressPercentage) + '%', backgroundColor: progressBarFillColor }}/>
							</View>
							{ minutesLeft == totalMinutes && 
								<Text secondary style={minuteTextStyle}>{totalMinutes} minutes</Text>
							}
							{ minutesLeft != totalMinutes && 
								<Text secondary style={minuteTextStyle}>{Math.round((this.props.duration - this.props.currentTime) / 60)} of {totalMinutes} minutes left</Text>
							}
						</View>
					</View>
				</View>
			</View>
		);
	}
}
export default EpisodeListItem;