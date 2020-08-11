import React from 'react';

import { Link, withRouter } from 'react-router-alias';

import {FaFolder,FaRegClock} from "react-icons/fa";

var categoryComponents = {};
// categoryComponents['FontAwesome'] = FontAwesomeIcons;
// categoryComponents['GamerIcons'] = GamerIcons;

categoryComponents['FontAwesome'] = FaFolder;
categoryComponents['FontAwesome2'] = FaRegClock;

// import styles from './CategoryListUI.css';
import styles from './../../SideBar.css';

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
		var IconComponent = categoryComponents['FontAwesome']; // categoryComponents[iconCategory][icon];
		
		if (name === 'Recent podcasts') {
			IconComponent = categoryComponents['FontAwesome2']
		}
		
		var className = this.props.selectedCategory === name ? styles.selectedCategory : styles.category;
		
		return (
			<div className={className} key={name} onClick={() => { if (clickFunction) { clickFunction(); } this.props.onSelectCategory(name); } }><IconComponent size="20" /> {name}</div>
		);
	}
	render() {
		return (
			<>
				{
					this.props.categories.map((category) => {
						return this.renderCategory(category.iconPack,category.icon,category.name)
					})
				}
			</>
		);
	}
}
export default withRouter(CategoryListUI);