import React, { useRef, useState } from 'react';

import { FaSearch } from "react-icons/fa";

import Events from './../library/Events.js';

import styles from './SearchField.css';

function SearchField(props) {
	const searchElement = useRef(null);
	const [searchText, setSearchText] = useState('');

	const onSearch = (event) => {
		Events.emit('OnSearch',searchText);
		event.preventDefault();
		searchElement.current.blur();
	};

	const onChangeHandler = (event) => {
		setSearchText(event.target.value);
	};

	return (
		<form action="." className={styles.searchFieldOuter} onSubmit={onSearch}>
		<div className={styles.searchIcon}><FaSearch size={18} /></div>
			<input placeholder="Search for a podcast" ref={searchElement} type="search" name="search" value={searchText} className={styles.searchField} onChange={onChangeHandler} />
		</form>
	);
}
/**
*
*/
/*
class SearchField extends Component {
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
	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
}
*/
export default SearchField;