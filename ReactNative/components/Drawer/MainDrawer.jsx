import React from 'react';

import SideMenu from 'react-native-side-menu-updated'

import { View, ScrollView, Text, TouchableHighlight } from 'react-native';

import SettingsListUI from './../Settings/SettingsListUI.jsx';

class MainMenu extends React.Component {
	render() {
		return (
			<View style={{ backgroundColor: '#FFFFFF' }}>
				<SettingsListUI />
			</View>
		);
	}
}
/*
class CategoryList extends React.Component {
	render() {
		return (
			<View style={{ backgroundColor: '#FFFFFF' }}>
				<Text>Categories</Text>
				<TouchableHighlight onPress={this.props.showPodcastList}>
					<Text>Click for Podcasts</Text>
				</TouchableHighlight>
			</View>
		);
	}
}
class PodcastList extends React.Component {
	render() {
		return (
			<View style={{ backgroundColor: '#FFFFFF' }}>
				<Text>This is a list of podcasts</Text>
			</View>
		);
	}
}
*/
class MainDrawer extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		/*
		this.state = {
			showPodcastList: false,
			showCategoryList: false
		};
		
		this.showPodcastList = this.showPodcastList.bind(this);
		this.showCategoryList = this.showCategoryList.bind(this);

		this.podcastListDrawerChanged = this.podcastListDrawerChanged.bind(this);
		this.categoryListDrawerChanged = this.categoryListDrawerChanged.bind(this);
		*/
	}
	/*
	categoryListDrawerChanged(isOpen) {
		this.setState({
			showCategoryList: isOpen
		});
	}
	podcastListDrawerChanged(isOpen) {
		this.setState({
			showPodcastList: isOpen
		});
	}
	showPodcastList() {
		this.setState({
			showPodcastList: true
		});
	}
	showCategoryList() {
		this.setState({
			showCategoryList: true
		});
	}
	*/
	render() {
		const mainMenu = <MainMenu showCategoryList={this.showCategoryList} />;
		
		return (
			<SideMenu menu={mainMenu} isOpen={this.props.isOpen} menuPosition={'left'}>
				{this.props.children}
			</SideMenu>
		);
		
		/*
		const categoryList = <CategoryList showPodcastList={this.showPodcastList} />;
		const podcastlist = <PodcastList />;

		return (
			<SideMenu menu={podcastlist} isOpen={this.state.showPodcastList} onChange={this.podcastListDrawerChanged} menuPosition={'left'}>
				<SideMenu menu={categoryList} isOpen={this.state.showCategoryList} onChange={this.categoryListDrawerChanged} menuPosition={'left'}>
					<SideMenu menu={mainMenu} isOpen={this.props.isOpen} menuPosition={'left'}>
						{this.props.children}
					</SideMenu>
				</SideMenu>
			</SideMenu>
		);
		*/
	}
}
export default MainDrawer;