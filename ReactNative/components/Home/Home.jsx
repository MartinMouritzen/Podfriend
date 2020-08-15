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
				
				<Card>
					<CardItem>
						<Body>
							<Text style={{ fontWeight: 'bold' }}>Welcome to Podfriend, I am so happy that you're here!</Text>
							<Text>This program is more or less a labor of love. I love podcasts, and I've never really been able to find a podcast app where there wasn't something that I thought could be improved, so I thought I'd give it a try myself. Of course nothing is perfect, but let's see how close we can get.</Text>
							<Text style={{ marginTop: 15 }}>This is a very early release, which means you're bound to find weird, unfinished and perhaps even comical things here. Some things might make no sense at all until they're further along in development. I'll try to limit those to selected hardcore testers, but you never know, so please be patient.</Text>
							<Text style={{ marginTop: 15 }}>You might also find really annoying bugs. Sorry for that in advance. I do a lot of testing, but I'm just one person. what I can do is promise you that I will fix the bugs as soon as I can.</Text>
							
							<Text style={{ marginTop: 15 }}>I hope together, we can have great fun, because everyone needs a Podfriend! ❤</Text>
							<Text>Martin.</Text>
						</Body>
					</CardItem>
				</Card>
				
				
				<View style={{ padding: 20 }}>
					<H2>Your latest podcasts</H2>
				</View>
				<LatestVisitedPodcasts />
				
				<View style={{ height: 100 }} />
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