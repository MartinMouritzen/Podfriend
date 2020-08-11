import React, { Component } from 'react';

import { connect } from "react-redux";
import { archivePodcast, unarchivePodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link, withRouter } from 'react-router-native';

import SubscribeButton from 'podfriend/Podcast/SubscribeButton.jsx';

import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { H1, Text, Icon, Button } from 'native-base';

import EpisodeList from './EpisodeList.jsx';

import {Dimensions } from 'react-native';

/**
*
*/
class PodCastPaneUI extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.state = {
			isMounted: false
		};
	}
	componentDidMount() {
		this.setState({
			isMounted: true
		});
	}
	getTopContent(screenWidth) {

		return (
			<View>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					{ this.props.selectedPodcast.artworkUrl600 && 
						<Image key='coverImage' style={{ width: screenWidth, height: screenWidth }} resizeMode="contain" source={{ uri: this.props.selectedPodcast.artworkUrl600 }} />
					}
					{ !this.props.selectedPodcast.artworkUrl600 && this.props.podcastLoading && 
						<Text>Loading</Text>
					}
				</View>
				<View style={{ flex: 1, margin: 10 }} >
					<H1 style={{ marginBottom: 10 }}>{this.props.selectedPodcast.name}</H1>
					
					{ this.props.selectedPodcast.author &&
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Link to={'/search/author/' + this.props.selectedPodcast.author + '/' + this.props.selectedPodcast.parentguid + '/'}>
								<View style={{ flex: 1, flexDirection: 'row', marginRight: 10 }}>
									<Icon type='FontAwesome' name='microphone' style={{ fontSize: 20, marginLeft: 10, marginRight: 5 }} />
									<Text>{this.props.selectedPodcast.author}</Text>
								</View>
							</Link>
							{ !!this.props.selectedPodcast.link &&
								<View onPress={() => { this.goToWebsite(this.props.selectedPodcast.link)}} style={{ flex: 1, flexDirection: 'row' }}>
									<Icon type='FontAwesome' name='globe' style={{ fontSize: 20, marginLeft: 10, marginRight: 5 }} />
									<Text>Website</Text>
								</View>
							}
						</View>
					}
				</View>
				<View style={{ flex: 1, margin: 10, marginTop: 0 }} >
					{ !this.props.description && !this.props.error && this.props.podcastLoading && 
						<Text>Description loading</Text>
					}
					{ (this.props.description || !this.props.podcastLoading) && 
						<Text secondary>{this.props.description}</Text>
					}
				</View>
				<View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
					<SubscribeButton
						selectedPodcast={this.props.selectedPodcast}
						subscribedPodcasts={this.props.subscribedPodcasts}
						subscribeToPodcast={this.props.subscribeToPodcast}
						unsubscribeToPodcast={this.props.unsubscribeToPodcast}
					/>
					<View style={{ flex: 1 }} />
				
					{ !this.props.isArchived && 
						<Button onPress={() => { this.props.archivePodcast(this.props.selectedPodcast); }} style={{ backgroundColor: '#4c749a' }}>
							<Icon type='FontAwesome' name='archive' style={{ fontSize: 20, marginRight: 5 }} />
							<Text>Archive</Text>
						</Button>
					}
					{ this.props.isArchived && 
						<Button iconLeft onPress={() => { this.props.unarchivePodcast(this.props.selectedPodcast); }} style={{ backgroundColor: '#4c749a' }}>
							<Icon type='FontAwesome' name='archive' style={{ fontSize: 20, marginLeft: 0, marginRight: 5 }} />
							<Text>Unarchive</Text>
						</Button>
					}
				</View>
				{ this.props.error &&
					<Text>
						Error reading Podcast File
					</Text>
				}
				{ !this.props.error && !this.props.selectedPodcastEpisodes && 
					<Text>Loading episodes</Text>
				}
			</View>
		);
	}
	/**
	*
	*/
	render() {
		const screenWidth = Math.round(Dimensions.get('window').width);
		
		var showList = this.state.isMounted && this.props.selectedPodcastEpisodes;
		
		return (
			<>
			{ !showList &&
				<ScrollView>
					{this.getTopContent(screenWidth)}
				</ScrollView>
			}
			{ showList &&
				<EpisodeList header={this.getTopContent(screenWidth)} currentPodcastPlaying={this.props.currentPodcastPlaying} onEpisodeSelect={this.props.onEpisodeSelect} podcastInfo={this.props.selectedPodcast} episodes={this.props.selectedPodcastEpisodes} />
			}
			</>

		);
		
		/*

				

						

				


				
				


			</View>
		);
		*/
	}
}

export default PodCastPaneUI;