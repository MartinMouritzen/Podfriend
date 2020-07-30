import React from 'react';

import { View } from 'react-native';

import { Link, withRouter } from 'react-router-alias';

import { Container, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';

class CategoryListUI extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
	}
	/**
	*
	*/
	renderCategory(iconCategory,icon,name,clickFunction) {
		/*
		var IconComponent = categoryComponents['FontAwesome']; // categoryComponents[iconCategory][icon];
		
		if (name === 'Recent podcasts') {
			IconComponent = categoryComponents['FontAwesome2']
		}
		*/
		// var className = this.props.selectedCategory === name ? styles.selectedCategory : styles.category;
		
		return (
			<Link to={{
					pathname: '/category/' + name
				}} key={name} component={ListItem} icon>
					<Left>
						<Button transparent>
							<Icon type="FontAwesome" name="folder" />
						</Button>
					</Left>
					<Body>
						<Text>{name}</Text>
					</Body>
			</Link>
		)
		
		return (
			<Text>{name}</Text>
		);
		/*
		return (
			<div className={className} key={name} onClick={() => { if (clickFunction) { clickFunction(); } this.props.onSelectCategory(name); } }><IconComponent size="20" /> {name}</div>
		);
		*/
	}
	render() {
		return (
			<Container>
				{ this.renderCategory('FontAwesome','home','Home',() => { this.props.history.push('/'); } ) }
				{
					this.props.categories.map((category) => {
						return this.renderCategory(category.iconPack,category.icon,category.name)
					})
				}
				{ this.renderCategory('FontAwesome','folder','Uncategorized') }
				{ this.renderCategory('FontAwesome','clock-o','Recent podcasts') }
			</Container>
		);
	}
}
export default withRouter(CategoryListUI);