import React from 'react';

import { Keyboard } from 'react-native';

import { Header, Left, Body, Right, Text, Icon, Button, Input, Item } from 'native-base';

import { withRouter } from 'react-router-native';

class SearchHeader extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			searchText: ''
		};
		
		this.onSearch = this.onSearch.bind(this);
		this.onSearchInputChange = this.onSearchInputChange.bind(this);
		this.canHistoryGo = this.canHistoryGo.bind(this);
		this.goBack = this.goBack.bind(this);
	}
	/**
	*
	*/
	canHistoryGo(number) {
		if (this.props.history.canGo) {
			return this.props.history.canGo(number);
		}
		return false;
	}
	/**
	*
	*/
	onSearch() {
		Keyboard.dismiss();

		this.props.history.push({
			pathname: '/search/' + this.state.searchText
		});
	}
	/**
	*
	*/
	onSearchInputChange(text) {
		this.setState({
			searchText: text
		});
	}
	/**
	*
	*/
	goBack() {
		this.props.history.goBack();
	}
	/**
	*
	*/
	render() {
		return (
			<Header searchBar>
				<Left style={{flex: null, width: 45 }}>
					<Button transparent onPress={() => { this.props.openDrawer(); }}>
						<Icon type="FontAwesome" name="bars"/>
					</Button>
				</Left>
				<Item>
					<Input placeholder="Search for a podcast" value={this.state.searchValue} onChangeText={this.onSearchInputChange} onSubmitEditing={this.onSearch} returnKeyType="search" />
					<Button transparent onPress={this.onSearch}>
						<Icon type="FontAwesome" name="search" />
					</Button>
				</Item>
			</Header>
		);
	}
}
export default withRouter(SearchHeader);

/*
				{ this.canHistoryGo(-1) &&
					<Left style={{flex: null, width: 45 }}>
						<Button transparent onPress={this.goBack}>
							<Icon type="FontAwesome" name="chevron-left"/>
						</Button>
					</Left>
				}
*/