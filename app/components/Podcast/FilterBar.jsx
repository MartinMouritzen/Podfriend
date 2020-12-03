import React from 'react';

import styles from './FilterBar.css';

const FilterBar = ({sortBy, sortType, changeSortBy, onlySeason, changeOnlySeason, seasons, hideListenedEpisodes, onHideListenedEpisodes, episodesListened}) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.filterItem}>
				<label htmlFor="sortDropDown">Sort by</label>
				<select id="sortDropDown" onChange={changeSortBy} value={sortBy + '_' + sortType}>
					{ seasons.length > 0 &&
						<>
							<option value="season_asc">Season</option>
							<option value="season_desc">Season newest first</option>
						</>
					}
					<option value="date_asc">Oldest episodes first</option>
					<option value="date_desc">Newest episodes first</option>
					<option value="duration_desc">Longest first</option>
					<option value="duration_asc">Shortest first</option>
				</select>
			</div>
			{ seasons.length > 0 &&
				<div className={styles.filterItem}>
					<label htmlFor="seasonDropDown">Show</label>
					<select id="seasonDropDown" onChange={changeOnlySeason} value={onlySeason}>
						<option value={'all'}>All seasons</option>
					{
						seasons.map((season,index) => {
							return (
								<option value={season.seasonNumber} key={'season_' + season.seasonNumber}>Season {season.seasonNumber}</option>
							)	
						})
					}
						<option value='bonus'>Only bonus</option>
					</select>
				</div>
			}
			{ episodesListened > 0 &&
				<div className={styles.hideListenedEpisodesFilter}>
					<input type="checkbox" id="hideListenedCheckbox" checked={hideListenedEpisodes} onChange={onHideListenedEpisodes} /> <label className={styles.hideListenedEpisodesLabel} htmlFor='hideListenedCheckbox'>Hide {episodesListened} listened episodes</label>
				</div>
			}
		</div>
	)
};
export default FilterBar;