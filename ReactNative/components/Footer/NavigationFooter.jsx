import React from 'react';

import { Link } from 'react-router-native';

import { Header, Left, Body, Right, Text, Icon, Button, Input, Item, Footer, FooterTab, Badge } from 'native-base';

class NavigationFooter extends React.Component {
	/**
	*
	*/
	render() {
		return (
			<Footer>
				<FooterTab>
					<Link to="/" component={Button} vertical>
						<Icon type="FontAwesome" active name="home" />
						<Text>Home</Text>
					</Link>
					<Link to="/podcasts/" component={Button} vertical badge>
						<Badge><Text>2</Text></Badge>
						<Icon type="FontAwesome" name="podcast" />
						<Text>Podcasts</Text>
					</Link>
					{/*
					<Link to="/" component={Button} vertical>
						<Icon type="FontAwesome" active name="star" />
						<Text>Favorites</Text>
					</Link>
					*/}
					<Link to="/" component={Button} vertical>
						<Icon type="FontAwesome" name="user" />
						<Text>Account</Text>
					</Link>
					<Link to="/search/murder" component={Button} vertical>
						<Icon type="FontAwesome" active name="search" />
						<Text>Search</Text>
					</Link>
				</FooterTab>
			</Footer>
		);
	}
}
export default NavigationFooter;