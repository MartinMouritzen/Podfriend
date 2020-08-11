import React from 'react';

import CategoryListUI from 'podfriend-ui/CategoryList/CategoryListUI.jsx';

class CategoryList extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.state ={
			loading: true,
			categories: [],
			selectedCategory: false
		};
		
		this.onSelectCategory = this.onSelectCategory.bind(this);
		this.loadCategories = this.loadCategories.bind(this);
	}
	componentDidMount() {
		var categories = this.loadCategories();
		
		this.setState({
			loading: false,
			categories: categories
		});
	}
	/**
	*
	*/
	onSelectCategory(categoryName) {
		this.setState({
			selectedCategory: categoryName
		});
	}
	/**
	*
	*/
	loadCategories() {
		return [
			{
				icon: 'GiBackstab',
				iconPack: 'GamerIcons',
				name: 'True Crime'
			},
			{
				icon: 'GiMagnifyingGlass',
				iconPack: 'GamerIcons',
				name: 'Mysteries'
			},
			{
				icon: 'GiTalk',
				iconPack: 'GamerIcons',
				name: 'Talk shows'
			},
			{
				icon: 'GiChickenOven',
				iconPack: 'GamerIcons',
				name: 'Cooking shows'
			},
		];
	}
	render() {
		return (
			<CategoryListUI
				UI={CategoryListUI}
				loading={this.state.loading}
				categories={this.state.categories}
				selectedCategory={this.state.selectedCategory}
				onSelectCategory={this.onSelectCategory}
			/>
		);
	}
}
export default CategoryList;