import React from 'react';

import { View } from 'react-native';

import { Content, H2, H3 } from 'native-base';

import FeedCard from 'podfriend-approot/components/Feed/FeedCard.jsx';
import CurrentlyPlaying from './../Cards/CurrentlyPlaying.jsx';

import LatestVisitedPodcasts from 'podfriend-approot/components/Lists/LatestVisitedPodcasts.jsx';

import Svg, { Path } from 'react-native-svg';

class Home extends React.Component {
	render() {
		return (
			<Content keyboardShouldPersistTaps="never" onScroll={this.props.onContentScroll} >
				<View style={{
						height: 254
				}}>
					<View style={{
						backgroundColor: '#0176e5',
						height: 45
					}}>
					</View>
					<View style={{ width: '100%', height: 91.5 }}>
						<Svg preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 1440 320">
							<Path fill="#0176e5" d="M0 96l60 5.3C120 107 240 117 360 112s240-27 360 0 240 101 360 122.7c120 21.3 240-10.7 300-26.7l60-16V0H0z"/>
						</Svg>
					</View>
					{ false &&
						<FeedCard />
					}
					<View style={{
						position: 'absolute',
						width: '100%'
					}}>

						<View style={{ padding: 16, paddingTop: 0 }}>
							<CurrentlyPlaying />
						</View>
					</View>
				</View>

				<View style={{ backgroundColor: '#f0f0f0', borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: '#d1d1d1', borderBottomColor: '#d1d1d1' }}>
					<View style={{ padding: 20, paddingBottom: 0 }}>
						<H3 style={{ fontFamily: 'Roboto_medium', marginBottom: 5, fontSize: 18, color: '#0176e5' }} sub>Your</H3>
                    	<H2 style={{ fontFamily: 'Roboto_medium', fontSize: 26, marginBottom: 12, color: '#0e469d' }}>Latest podcasts</H2>
					</View>
					<LatestVisitedPodcasts />
				</View>
				
				<View style={{  }}>
					<View style={{ padding: 20, paddingBottom: 0 }}>
						<H3 style={{ fontFamily: 'Roboto_medium', marginBottom: 5, fontSize: 18, color: '#0176e5' }} sub>Browse by</H3>
                    	<H2 style={{ fontFamily: 'Roboto_medium', fontSize: 26, marginBottom: 12, color: '#0e469d' }}>Categories</H2>
					</View>
					<LatestVisitedPodcasts />
				</View>


				<View style={{ height: 80 }} />
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