import React from 'react';

import { View, ScrollView } from 'react-native';

import { Link } from 'react-router-native';

import { Left, Body, Right, Content, Card, CardItem, Text, H1, H2 } from 'native-base';

import LatestVisitedPodcasts from 'podfriend-approot/components/Lists/LatestVisitedPodcasts.jsx';

class Home extends React.Component {
	render() {
		return (
			<Content keyboardShouldPersistTaps="never">

				<View style={{ padding: 20 }}>
					<H1>Welcome to Podfriend!</H1>
				</View>
				
				
				<View style={{ padding: 20 }}>
					<H2>Your latest podcasts</H2>
				</View>
				<LatestVisitedPodcasts />
				
				<View style={{ padding: 20 }}>
					<H2>Most listened</H2>
				</View>
				<LatestVisitedPodcasts />
				
				<View style={{ height: 50 }} />
			</Content>
		);
		
		// <View style={ customStyle.box }>
		/*
		return (
			<Card>
				<Card.Title title="Podfriend is amazing!" subtitle="Yes it is." />
				<Card.Content>
					<Button title="Go to Podcast" mode="contained" onPress={() => { console.log('navigating'); this.props.navigation.navigate('Podcast') }}>
						Go to Podcast page
					</Button>
				</Card.Content>
			</Card>
		);
		*/
	}
}
export default Home;