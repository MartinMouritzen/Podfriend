import React from 'react';

import { connect } from "react-redux";

import { Link, withRouter } from 'react-router-alias';

import { ScrollView, View, Image } from 'react-native';
import { Content, Text } from 'native-base';

import LinearGradient from 'react-native-linear-gradient';

import Player from 'podfriend/Player.jsx';
import PlayerUI from 'podfriend/Episode/EpisodePlayer.jsx';

class EpisodePane extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var gradientColors = ['#cf5c36', '#a8382e', '#471e1e', '#000000'];
		
		return (
			<LinearGradient start={{x: 1, y: 0}} end={{x: 1, y: 1}} colors={gradientColors}
				style={{
					flex: 1, flexDirection: 'column'
				}}
			>
				<ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>
					{ true &&
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: '#000000',
								width: 370,
								height: 370,
								borderRadius: 15,
								overflow: 'hidden',
								shadowColor: "#000000",
								shadowOffset: {
									width: 0,
									height: 0,
								},
								shadowOpacity: 0.25,
								shadowRadius: 3.84,
								elevation: 5
							}}
						>
							<Image
								source={{ uri: this.props.activeEpisode.image ? this.props.activeEpisode.image : this.props.activePodcast.artworkUrl600 }}
								style={{
									width: 370,
									height: 370
								}}
							/>
						</View>
					}
					<Text style={{ color: '#FFFFFF' }}>Episode</Text>
				</ScrollView>
				<View style={{ height: 60 }}>
					<PlayerUI />
				</View>
			</LinearGradient>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode
	};
}


const ConnectedEpisodePane = withRouter(connect(
	mapStateToProps,
	null
)(EpisodePane));

export default ConnectedEpisodePane;