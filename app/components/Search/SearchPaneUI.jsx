import React, { Component } from 'react';
import Select from 'react-select'

import SearchResult from './SearchResult.jsx';

import styles from './SearchPane.css';

class SearchPaneUI extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={styles.searchPane}>
				{ !this.props.query &&
					<React.Fragment>
						Recent searches
					</React.Fragment>
				}
				{ this.props.query &&
					<React.Fragment>
						{ this.props.searchType == 'podcast' &&
							<h1>Search results for &quot;{this.props.query}&quot;</h1>
						}
						{ this.props.searchType == 'author' &&
							<h1>Podcasts by {this.props.query}</h1>
						}
						{ this.props.searchError &&
								<div>
									{this.props.searchError}
								</div>
						}
						{ this.props.searchGenres && this.props.searchGenres.length > 0 &&
							<div className={styles.genreSelectArea}>
								Only show podcasts in
									<Select className={styles.genreSelect} placeholder="Select category" isSearchable={false} isMulti={true} options={this.props.searchGenres.map((genre) => { return { value: genre, label: genre }; }) } onChange={this.onGenreFilterChange} />
							</div>
						}		
						{ !this.props.searchError && this.props.searching &&
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
						{ !this.props.searchError && !this.props.searching && this.props.searchResults && this.props.searchResults.length > 0 &&
							<div className={styles.searchResults}>
							{ this.props.searchResults.map((result,index) => {
								var showResult = false;
								if (!this.props.selectedGenres || this.props.selectedGenres.length == 0) {
									showResult = true;
								}
								else if (this.props.selectedGenres && this.props.selectedGenres.length > 0)  {
									if (result.genres && result.genres.length > 0) {
										result.genres.forEach((genre) => {
											if (this.props.selectedGenres.includes(genre)) {
												showResult = true;
											}
										});
									}
								}
								if (showResult) {	
									return (
										<SearchResult key={index} result={result} />
									)
								}
							}) }
							</div>
						}
						{ !this.props.searching && this.props.searchResults && this.props.searchResults.length === 0 && 
							<React.Fragment>
								No results found.
							</React.Fragment>
						}
					</React.Fragment>
				}
			</div>
		);
	}
}

export default SearchPaneUI;