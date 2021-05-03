import React, { useRef, useState } from 'react';

import { FaSearch } from "react-icons/fa";

import SearchHints from './SearchHints.jsx';

import Events from '../../library/Events.js';

import styles from './SearchField.css';

var blurTimeOutId = false;

const SearchField = () => {
	const searchElement = useRef(null);
	const [searchText, setSearchText] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	// const [hintsAreVisible, setHintsAreVisible] = useState(false);

	const onFocus = () => {
		clearTimeout(blurTimeOutId);
		console.log('setting focus true');
		setIsFocused(true);
		// console.log('setting hints visible true');
		// setHintsAreVisible(true);
	};
	const onBlur = () => {
		setTimeout(() => {
			setIsFocused(false);
			console.log('setting focus false');
		},100);
		/*
		blurTimeOutId = setTimeout(() => {
			console.log('setting hintsvisible false');
			setHintsAreVisible(false);	
		},7400);
		*/
	};

	const onSearch = (event) => {
		Events.emit('OnSearch',searchText);
		event.preventDefault();
		searchElement.current.blur();
	};

	const doSearch = (query) => {
		setSearchText(query);
	};

	const onChangeHandler = (event) => {
		setSearchText(event.target.value);
	};

	return (
		<>
			<form action="." className={styles.searchFieldOuter} onSubmit={onSearch}>
				<div className={styles.searchIcon}>
					<FaSearch size={18} />
				</div>
				<input placeholder="Search for a podcast" ref={searchElement} onFocus={onFocus} onBlur={onBlur} type="search" name="search" value={searchText} className={styles.searchField} onChange={onChangeHandler} autoComplete="off" />
				<SearchHints doSearch={doSearch} isFocused={isFocused && searchText !== ''} query={searchText} searchElement={searchElement} />
			</form>
		</>
	);
}
export default SearchField;