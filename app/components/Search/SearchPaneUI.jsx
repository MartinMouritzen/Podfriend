import React, { useState, useEffect } from 'react';
import Select from 'react-select'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SearchResult from './SearchResult.jsx';

import styles from './SearchPane.css';

import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonButton,
	IonIcon,
	IonContent,
	IonBackButton,
	IonMenuButton,
	IonSearchbar,
	IonSegment,
	IonSegmentButton,
	IonLabel,
	IonReactRouter,
	IonRouterOutlet
} from '@ionic/react';

const SearchPaneUI = ({ query, useSearchType, searching, searchResults, searchError, searchGenres, selectedGenres, onGenreFilterChange, onSearchTypeChange }) => {

	const [searchType,setSearchType] = useState(useSearchType);

	const handleTabChange = (event, newValue) => {
		setSearchType(newValue);
		onSearchTypeChange(newValue);
	};

	return (
		<IonPage>
			<IonHeader translucent="true">
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref='/' />
					</IonButtons>
					<IonTitle>
						{ searchType === 'podcast' &&
							<>Podcast results</>
						}
						{ searchType === 'person' &&
							<>People results</>
						}
						{ searchError &&
							<>{searchError}</>
						}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen="true">
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">
							{ searchType === 'podcast' &&
								<>Podcast results</>
							}
							{ searchType === 'person' &&
								<>People results</>
							}
							{ searchError &&
								<>{searchError}</>
							}
						</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className={styles.searchPane}>
					<p>{query}</p>
					<Tabs
						value={searchType}
						onChange={handleTabChange}
						style={{ marginLeft: '10px' }}
						TabIndicatorProps={{
							style: {
								backgroundColor: '#0176e5'
							}
						}}
					>
						<Tab label="Podcasts" value="podcast" style={{ border: '0px' }} />
						<Tab label="People" value="person" />
					</Tabs>
					{ !query &&
						<React.Fragment>
							Recent searches
						</React.Fragment>
					}
					{ query &&
						<React.Fragment>
							{ searchGenres && searchGenres.length > 0 &&
								<div className={styles.genreSelectArea}>
									Only show podcasts in
										<Select className={styles.genreSelect} placeholder="Select category" isSearchable={false} isMulti={true} options={searchGenres.map((genre) => { return { value: genre, label: genre }; }) } onChange={onGenreFilterChange} />
								</div>
							}		
							{ !searchError && searching &&
									<div className='podcastGrid'>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
										<div className="loading-line loading-podcast-item">&nbsp;</div>
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
			</IonContent>
		</IonPage>
	);
}
export default SearchPaneUI;