import React, { Component } from 'react';

import { connect } from "react-redux";
import { archivePodcast, unarchivePodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link, withRouter } from 'react-router-native';

import ReadMore from './../UI/Common/ReadMore.jsx';
// import ReadMore from '@fawazahmed/react-native-read-more';

import SubscribeButton from 'podfriend/Podcast/SubscribeButton.jsx';

import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { H1, Text, Icon, Button, Segment } from 'native-base';

// import { Container, List, ListItem, Thumbnail, Text, Left, Body, Right, Segment, Button, Icon } from 'native-base';
import FallbackImage from './../UI/Common/FallbackImage.jsx';

import EpisodeList from './EpisodeList.jsx';

import Svg, { Path } from 'react-native-svg';

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
	goToWebsite(link) {
		console.log('going to website: ' + link);
	}
	getTopContent(screenWidth) {
		return (
			<View>

				<View style={{
						height: 180
				}}>
					<View style={{
						backgroundColor: '#0176e5',
						height: 105
					}}>
					</View>
					<View style={{ width: '100%', height: 91.5 }}>
						<Svg preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 1440 320">
							<Path fill="#0176e5" d="M0 96l60 5.3C120 107 240 117 360 112s240-27 360 0 240 101 360 122.7c120 21.3 240-10.7 300-26.7l60-16V0H0z"/>
						</Svg>
					</View>
					<View style={{
						position: 'absolute',
						width: '100%',
						flex: 1,
						flexDirection: 'row'
					}}>
						<View style={{ padding: 16, paddingTop: 16 }}>
							<View style={{
								width: 150,
								height: 150,
								borderRadius: 10,
								overflow: 'hidden',
								borderColor: '#FFFFFF',
								borderWidth: 2,
								elevation: 25
							}}>
								<FallbackImage noImageNote={this.props.selectedPodcast.name} key='coverImageInner' style={{ width: 150, height: 150 }} source={{ uri: this.props.selectedPodcast.artworkUrl600 }} />
							</View>
						</View>
						<View style={{
							marginTop: 20,
							flex: 1
						}}>
							<View style={{

							}}>
								{ this.props.selectedPodcast.author.length > 0 &&
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<Link to={'/search/author/' + this.props.selectedPodcast.author + '/' + this.props.selectedPodcast.parentguid + '/'}>
											<View style={{ flex: 1, flexDirection: 'row' }}>
												<Icon type='FontAwesome' name='microphone' style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, marginRight: 5 }} />
												<Text style={{ color: 'rgba(255,255,255,0.6)'}}>{this.props.selectedPodcast.author}</Text>
											</View>
										</Link>
										{ false && !!this.props.selectedPodcast.link &&
											<View onPress={() => { this.goToWebsite(this.props.selectedPodcast.link)}} style={{ flex: 1, flexDirection: 'row' }}>
												<Icon type='FontAwesome' name='globe' style={{ color: '#BBBBBB', fontSize: 20, marginLeft: 10, marginRight: 5 }} />
												<Text style={{ color: '#BBBBBB'}}>Website</Text>
											</View>
										}
									</View>
								}
							</View>
							<H1 numberOfLines={2} style={{ fontSize: 24, marginTop: 10, marginBottom: 10, marginRight: 16, color: '#FFFFFF', fontFamily: 'Roboto_medium' }}>
								{this.props.selectedPodcast.name}
							</H1>
						</View>
					</View>
				</View>

				<View style={{ flex: 1, flexDirection: 'row', margin: 16 }}>
					<View style={{ flex: 1 }}>
						<Text>Rating</Text>
					</View>
					<View>
						<SubscribeButton
							selectedPodcast={this.props.selectedPodcast}
							subscribedPodcasts={this.props.subscribedPodcasts}
							subscribeToPodcast={this.props.subscribeToPodcast}
							unsubscribeToPodcast={this.props.unsubscribeToPodcast}
						/>
					</View>
				</View>

				<View style={{ margin: 16, marginTop: 0, marginBottom: 10 }} >
					{ !this.props.description && !this.props.error && this.props.podcastLoading && 
						<Text>Description loading</Text>
					}
					{ (this.props.description || !this.props.podcastLoading) && 
						<ReadMore numberOfLines={5} style={{color: 'rgb(0,0,0)', fontSize: 16, lineHeight: 22 }} seeMoreText='Read more' seeLessText='Hide text' seeMoreStyle={{ color: '#0176e5', fontWeight: 'bold' }} seeLessStyle={{ color: '#0176e5', fontWeight: 'bold' }}>
							{this.props.description}
						</ReadMore>
					}
				</View>
				
				<View style={{ flex: 1, margin: 10, flexDirection: 'column' }}>

					<View style={{ height: 5 }} />
				
					{ !this.props.isArchived && 
						<Button block onPress={() => { this.props.archivePodcast(this.props.selectedPodcast); }} style={{ backgroundColor: '#4c749a' }}>
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
				{  this.state.isMounted && this.props.selectedPodcastEpisodes && 
					<View>
						<Text>Episodes</Text>
					</View>
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
	}
}

export default PodCastPaneUI;