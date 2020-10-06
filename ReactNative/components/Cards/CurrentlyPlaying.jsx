import React from 'react';

import { connect } from "react-redux";

import { Link } from 'react-router-alias';

import FallbackImage from './../UI/Common/FallbackImage.jsx';

import { TouchableHighlight, View, Image } from 'react-native';
import { Text, Icon, Button, Spinner, H2, H3 } from 'native-base';

import sanitizeHtml from 'sanitize-html';

// import testImage from './../../images/logo/podfriend_logo_128x128.png';
// console.log('test: ' + testImage);

class CurrentlyPlaying extends React.Component {
	constructor(props) {
        super(props);
    }
    render() {
		var description = '';

        var progressPercentage = Math.round(this.props.activeEpisode.currentTime ? (100 * this.props.activeEpisode.currentTime) / this.props.activeEpisode.duration : 0);
		if (progressPercentage > 100) {
			progressPercentage = 100;
		}

		let headerText = 'Current podcast';
		let subHeaderText = 'Your';
		var PodfriendLogo = false;
		let podcastTitle = '';
		let episodeTitle = '';

		if (!this.props.activeEpisode) {
			headerText = 'Podfriend';
			subHeaderText = 'Welcome to';
			var PodfriendLogo = require('./../../images/logo/podfriend_logo_256x256.png');
			description = 'Welcome to the beta of Podfriend. If you find any bugs or have ideas for improvements, get in touch through the website!';
			podcastTitle = 'Beta 1.0';
			episodeTitle = 'Happy to see you!';
		}
		else {
			description = sanitizeHtml(this.props.activeEpisode ? this.props.activeEpisode.description : 'No description.',{
				allowedTags: []
			});
			description = description.trim();
			podcastTitle = this.props.activePodcast.name;
			episodeTitle = this.props.activeEpisode.title;
		}
		let coverImage = this.props.activePodcast && this.props.activePodcast.artworkUrl600 ? { uri: this.props.activePodcast.artworkUrl600 } : PodfriendLogo;

        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                borderRadius: 10
            }}>
                <View style={{
                    flex: 1,
                    marginLeft: 0,
                    marginRight: 15
                }}>
                    <H3 numberOfLines={1} style={{ fontFamily: 'Roboto_medium', marginBottom: 5, fontSize: 18 }} sub>{subHeaderText}</H3>
                    <H2 numberOfLines={1} style={{ fontFamily: 'Roboto_medium', fontSize: 26 }} root>{headerText}</H2>

                    <View style={{ marginTop: 30 }}>
						<H3 numberOfLines={1} style={{ fontSize: 12, color: 'rgba(14,70,157,0.71)' }}>{podcastTitle}</H3>
                        <H3 numberOfLines={1} style={{ fontFamily: 'Roboto_medium', fontSize: 20, marginBottom: 10 }}>
                            {episodeTitle}
                        </H3>
                        <Text numberOfLines={5} style={{ fontFamily: 'Roboto', fontSize: 13, color: '#062d59' }}>
                            {description}
                        </Text>
                    </View>
                </View>
                <View style={{ marginTop: 22 }}>
                    <Link
                        to={{ pathname: '/podcast/' + this.props.activePodcast.path, state: { podcast: this.props.activePodcast } }}
                        underlayColor="#0176e5"
                        key={this.props.activePodcast.path}
                        style={{
                            width: 172,
                            height: 172,
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                            borderRadius: 15,
                            overflow: 'hidden',
							elevation: 5
                        }}
                    >
                        <FallbackImage noImageNote={this.props.activePodcast.name} key='coverImage' style={{ width: 170, height: 170 }} source={coverImage} />
                    </Link>
					{ this.props.activePodcast &&
						<View style={{ marginTop: 10, marginLeft: 4, marginRight: 4 }}>
							<View style={{ borderWidth: 1, borderColor: '#999ca1', width: '100%', height: 14, borderRadius: 15, overflow: 'hidden' }}>
								<View style={{ backgroundColor: '#28bd72', width: progressPercentage + '%', height: '100%' }}>
								
								</View>
							</View>
							<Text style={{ color: '#828282', fontSize: 10, marginTop: 4 }}>
								{progressPercentage}% of episode {this.props.activeEpisode.episodeNumber ? this.props.activeEpisode.episodeNumber : ''} completed
							</Text>
						</View>
					}
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode
	};
}

const ConnectedCurrentlyPlaying = connect(
	mapStateToProps,
	null
)(CurrentlyPlaying);

export default ConnectedCurrentlyPlaying;