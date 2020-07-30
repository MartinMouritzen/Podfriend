import React, { Component } from 'react';

import { FaSearch } from "react-icons/fa";

import Events from './../library/Events.js';

import styles from './SearchField.css';

/**
*
*/
class SearchField extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		return (
			<form className={styles.searchFieldOuter} onSubmit={(event) => { Events.emit('OnSearch',this.state.value); event.preventDefault(); }}>
				<div className={styles.searchIcon}><FaSearch size={18} /></div>
				<input placeholder="Search for a podcast" type="text" value={this.state.value} className={styles.searchField} onChange={this.handleChange} />
			</form>
		);
	}
	/**
	*
	*/
	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
}
export default SearchField;