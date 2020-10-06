import React from 'react';

import { View } from 'react-native';

import { Thumbnail, Left, Body, Right, Content, Card, CardItem, Text, H1, H2 } from 'native-base';

// import logo from 'podfriend-approot/images/logo/podfriend_logo_128x128.png';
var logo = require('podfriend-approot/images/logo/podfriend_logo_128x128.png');

class FeedCard extends React.Component {
	constructor(props) {
		super(props);
		// maybe use https://github.com/expo/react-native-read-more-text
	}
	render() {
		return (
			<Card style={{ marginTop: 10 }}>
				<CardItem>
					<Left>
						<Thumbnail source={{ uri: 'https://api.podfriend.com/resources/logo_no_border_512x512.png' }} style={{ borderWidth: 2, borderColor: 'black' }} />
						<Body>
							<Text>Podfriend</Text>
							<Text note>11h</Text>
						</Body>
					</Left>
				</CardItem>
				<CardItem>
					<Body>
						<Text numberOfLines={6}>
							<Text style={{ fontWeight: 'bold' }}>Welcome to Podfriend!</Text>
							<Text>I am so happy that you're here!</Text>
							<Text>This program is more or less a labor of love. I love podcasts, and I've never really been able to find a podcast app where there wasn't something that I thought could be improved, so I thought I'd give it a try myself. Of course nothing is perfect, but let's see how close we can get.</Text>
							<Text style={{ marginTop: 15 }}>This is a very early release, which means you're bound to find weird, unfinished and perhaps even comical things here. Some things might make no sense at all until they're further along in development. I'll try to limit those to selected hardcore testers, but you never know, so please be patient.</Text>
							<Text style={{ marginTop: 15 }}>You might also find really annoying bugs. Sorry for that in advance. I do a lot of testing, but I'm just one person. what I can do is promise you that I will fix the bugs as soon as I can.</Text>
							
							<Text style={{ marginTop: 15 }}>I hope together, we can have great fun, because everyone needs a Podfriend! </Text>
							<Text>Martin.</Text>
						</Text>
						<Text>See more...</Text>
					</Body>
				</CardItem>
			</Card>
		);
	}
}
export default FeedCard;