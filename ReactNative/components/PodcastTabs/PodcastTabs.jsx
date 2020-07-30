import React from 'react';

import CategoryList from 'podfriend/CategoryList/CategoryList.jsx';
import CategoryListUI from 'podfriend-ui/CategoryList/CategoryListUI.jsx';

import FavoriteList from 'podfriend/Favorites/FavoriteList.jsx';
import FavoriteListUI from './../Favorites/FavoriteListUI.jsx';

import { ScrollView } from 'react-native';

import { Content, Tab, Tabs, Text } from 'native-base';

class PodcastTabs extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

	}
	render() {
		return (
			<Content>
				<Tabs>
					<Tab heading="Favorites">
						<FavoriteList UI={FavoriteListUI} />
					</Tab>
					<Tab heading="By category">
						<CategoryList UI={CategoryListUI} />
					</Tab>
					<Tab heading="Recent">
						<Text>Recent</Text>
					</Tab>
				</Tabs>
			</Content>
		);
	}
}
export default PodcastTabs;