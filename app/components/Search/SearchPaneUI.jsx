import React, { useState, useEffect } from 'react';
import Select from 'react-select'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SearchResult from './SearchResult.jsx';

import styles from './SearchPane.css';

const SearchPaneUI = ({ query, useSearchType, searching, searchResults, searchError, searchGenres, selectedGenres, onGenreFilterChange, onSearchTypeChange }) => {

	const [searchType,setSearchType] = useState(useSearchType);

	const handleTabChange = (event, newValue) => {
		setSearchType(newValue);
		onSearchTypeChange(newValue);
	};

	return (
		<div className={styles.searchPane}>
			<Tabs
				value={searchType}
				onChange={handleTabChange}
				style={{ marginLeft: '10px' }}
			>
				<Tab label="Podcasts" value="podcast" />
				<Tab label="People" value="person" />
			</Tabs>
			{ !query &&
				<React.Fragment>
					Recent searches
				</React.Fragment>
			}
			{ query &&
				<React.Fragment>
					{ searchType === 'podcast' &&
						<h1>Podcast results for &quot;{query}&quot;</h1>
					}
					{ searchType === 'person' &&
						<h1>People results for &quot;{query}&quot;</h1>
					}
					{ searchError &&
						<div>
							{searchError}
						</div>
					}
					{ searchGenres && searchGenres.length > 0 &&
						<div className={styles.genreSelectArea}>
							Only show podcasts in
								<Select className={styles.genreSelect} placeholder="Select category" isSearchable={false} isMulti={true} options={searchGenres.map((genre) => { return { value: genre, label: genre }; }) } onChange={onGenreFilterChange} />
						</div>
					}		
					{ !searchError && searching &&
							<div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
								<div className="loading-line loading-podcast">&nbsp;</div>
							</div>
					}
					{ !searchError && !searching && searchResults && searchResults.length > 0 &&
						<div className='podcastGrid'>
						{ searchResults.map && searchResults.map((result,index) => {
							var showResult = false;
							if (!selectedGenres || selectedGenres.length == 0) {
								showResult = true;
							}
							else if (selectedGenres && selectedGenres.length > 0)  {
								if (result.genres && result.genres.length > 0) {
									result.genres.forEach((genre) => {
										if (selectedGenres.includes(genre)) {
											showResult = true;
										}
									});
								}
							}
							if (showResult) {	
								return (
									<SearchResult searchType={searchType} key={index} result={result} />
								)
							}
						}) }
						</div>
					}
					{ !searching && searchResults && searchResults.length === 0 && 
						<div style={{ padding: 15 }}>
							No results found.
						</div>
					}
				</React.Fragment>
			}
		</div>
	);
}
export default SearchPaneUI;