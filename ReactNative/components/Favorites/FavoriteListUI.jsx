import React from 'react';

import { View } from 'react-native';

import PodcastUtil from 'podfriend-approot/library/PodcastUtil.js';

import { Link, withRouter } from 'react-router-alias';

import { List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';


class FavoriteListUI extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

	}
	render() {
		return (
			<View style={{ backgroundColor: '#FFFFFF' }}>
				<List>
				
				{ this.props.subscribedPodcasts && this.props.subscribedPodcasts.length === 0 &&
					<View>
						<Text>You have not added any podcasts to this category yet.</Text>
						<Text>Favorite a podcast, and put it in here!</Text>
					</View>
				}
					{ this.props.subscribedPodcasts && this.props.subscribedPodcasts.map((podcast,index) => {
						
						var isArchived = !this.props.showArchived && podcast.archived;
						if (podcast.archived) {
							hasArchivedPodcast = true;
						}
						var isPlaying = this.props.activePodcast && this.props.activePodcast.feedUrl == podcast.feedUrl;
						
						var podcastPath = this.props.location.pathname.substring(9);
						var isSelected = podcast.path == podcastPath;

						var podcastInternalUrl = '/podcast/' + PodcastUtil.generatePodcastUrl(podcast.name) + '/';

						return (
							<Link to={{
									pathname: '/podcast/' + podcast.path,
									state: {
										podcast: podcast
									}
								}} key={podcast.name} component={ListItem} thumbnail>
									<Left>
										<Thumbnail square source={{ uri: podcast.artworkUrl60 }} />
									</Left>
									<Body>
										<Text>{podcast.name}</Text>
										<Text note numberOfLines={1}>12 episodes, 2 new</Text>
									</Body>
									{/*
									<Right>
										<Button transparent>
											<Icon type="FontAwesome" name="heart" />
											<Icon type="FontAwesome5" name="heart-broken" />
										</Button>
									</Right>
									*/}
							</Link>
						)
					}) 
				}
				</List>
			</View>
		);
	}
}
export default withRouter(FavoriteListUI);