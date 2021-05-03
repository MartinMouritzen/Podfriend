import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { useSelector } from 'react-redux';

import Events from '../../library/Events.js';

import styles from './SearchHints.scss';

var fetchId = false;
var abortController = new AbortController();

const SearchHints = ({ query, searchElement = false, isFocused = false, doSearch }) => {
	const searchHintsContainer = useRef(null);
	const [results,setResults] = useState(false);

	const authToken = useSelector((state) => { return state.user.authToken});

	const getSearchHintsContainer = () => {
		if (!searchHintsContainer.current) {
			searchHintsContainer.current = document.createElement('div');
		}
		
		useEffect(() => {
			searchHintsContainer.current.setAttribute('class','searchHintPortal');
			document.body.appendChild(searchHintsContainer.current);

			return () => {
				document.body.removeChild(searchHintsContainer.current);
			};
		},[]);

		return searchHintsContainer.current;
	};

	useEffect(() => {
		if (fetchId) {
			console.log('clearing timeout');
			clearTimeout(fetchId);
		}
		try {
			console.log('aborting signal');
			abortController.abort();
		}
		catch(exception) {
			console.log('Error aborting fetch');
		}
		fetchId = setTimeout(() => {
			if (query) {
				abortController = new AbortController();
				fetch('https://api.podfriend.com/search/hints.php?query=' + query, {
					method: "GET",
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Authorization': `Bearer ${authToken}`
					},
					signal: abortController.signal
				})
				.then((resp) => {
					return resp.json()
				})
				.then((rawResults) => {
					if (rawResults && rawResults.hints) {
						setResults(rawResults.hints);
					}
					else {
						setResults(false);
					}
				})
				.catch((exception) => {
					console.log('Error in search hint');
					console.error(exception);
				});
			}
		},100);
	},[query]);

	var left = 0;
	var top = 0;
	var width = 0;
	if (searchElement !== false && searchElement.current) {
		var boundingRect = searchElement.current.parentNode.parentNode.getBoundingClientRect();
		left = boundingRect.left;
		top = boundingRect.bottom + 5;
	}

	var height = (results !== false ? results.length * 50 : 0);
	// To make room for the title and the search for
	height += (results !== false && results.length > 0) ? 100 : 50;

	return ReactDOM.createPortal((
		<div
			className={styles.searchHintsContainer + ' ' + (isFocused ? styles.searchHintsContainerFocused : styles.searchHintsContainerNotFocused)}
			style={{ top: top, left: left, height: height }}
		>
			<div className={styles.searchHintResults}>
				{ results !== false && results.length > 0 &&
					<div className={styles.searchHintPodcastTitle}>
						You might be looking for
					</div>
				}
				{ results !== false && results.map((result) => {
					return (
						<div
							className={styles.searchHintResult}
							key={result.hint}
							onClick={() => { doSearch(result.hint); Events.emit('OnSearch',result.hint); }}
						>
							<div className={styles.searchHintLabel}>Podcast</div>
							<div className={styles.searchHintText}>
								{result.hint}
							</div>
						</div>
					);
				}) }
				<div
					className={styles.searchHintResult}
					onClick={() => { console.log(query); doSearch(query); Events.emit('OnSearch',query); }}>
						<div className={styles.searchHintText}>
							Search for {query}
						</div>
					</div>
			</div>
		</div>
	), getSearchHintsContainer())
};

export default SearchHints;