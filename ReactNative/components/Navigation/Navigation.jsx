import React from 'react';

import { Link, withRouter, matchPath } from 'react-router-native';
import { View } from 'react-native';

import { Header, Left, Body, Right, Text, Icon, Button, Input, Item, Footer, FooterTab, Badge } from 'native-base';

/* WITH BADGE
					<Link to="/podcasts/" component={Button} vertical badge>
						<Badge><Text>2</Text></Badge>
						<Icon type="FontAwesome" name="podcast" />
						<Text>Podcasts</Text>
					</Link>
*/
class NavigationFooter extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isCompact: true
		};
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.location !== prevProps.location) {
			var matchResult = matchPath(this.props.location.pathname, { path: '/podcast/:podcastName/episode/:episode/' });
			if (matchResult && matchResult.isExact) {
				// We are looking at an episode. Time to remove this player.
				this.setState({
					isCompact: false
				},() => {
					this.toggleCompactState(false);
				});
			}
			else {
				this.setState({
					isCompact: true
				},() => {
					this.toggleCompactState(true);
				});
			}

		}
		// if (prevProps.shouldPlay != this.props.shouldPlay) {
			// this.togglePlaying(this.props.shouldPlay);
		// }
	}
	/**
	*
	*/
	toggleCompactState(isCompact) {

	}
	/**
	*
	*/
	render() {
		return (
			<View style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'center' }}>
					<Link to="/" component={Button} vertical active transparent style={{ marginRight: 20 }}>
						<Icon type="FontAwesome" active name="home" style={{ color: '#6b6b6b' }} />
						<Text style={{ fontSize: 11, color: '#6b6b6b', marginTop: 2 }}>Home</Text>
					</Link>
					<Link to="/podcasts/" component={Button} vertical transparent style={{ marginRight: 20 }}>
						<Icon type="FontAwesome" name="podcast" style={{ color: '#6b6b6b' }} />
						<Text style={{ fontSize: 11, color: '#6b6b6b', marginTop: 2 }}>Podcasts</Text>
					</Link>
					<Link to="/search/murder" component={Button} vertical transparent>
						<Icon type="FontAwesome" active name="search" style={{ color: '#6b6b6b' }} />
						<Text style={{ fontSize: 11, color: '#6b6b6b', marginTop: 2 }}>Search</Text>
					</Link>
			</View>
		);
	}
}
export default withRouter(NavigationFooter);