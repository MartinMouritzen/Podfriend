import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { playEpisode, updatePodcastSettings } from "podfriend-approot/redux/actions/podcastActions";

// import { AutoSizer, WindowScroller , CellMeasurer, CellMeasurerCache, List } from "react-virtualized";

import { FaCheck } from 'react-icons/fa';

import FilterBar from './FilterBar.jsx';

import EpisodeListItem from './EpisodeListItem.jsx';

import styles from './EpisodeList.scss';

const EpisodeList = ({ podcastPane, podcastInfo, episodes, showFilterBar = true, rssFeed = false }) => {
	const dispatch = useDispatch();

	/*
	const cellCache = new CellMeasurerCache({
		fixedWidth: true,
		minHeight: 160
	});
	*/

	const selectedPodcast = useSelector((state) => state.podcast.selectedPodcast);
	const activeEpisode = useSelector((state) => state.podcast.activeEpisode);
	const isPlaying = useSelector((state) => state.audio.isPlaying);

	const [sortBy,setSortBy] = useState(selectedPodcast.sortBy ? selectedPodcast.sortBy : 'date');
	const [sortType,setSortType] = useState(selectedPodcast.sortType ? selectedPodcast.sortType : 'desc');
	const [onlySeason,setOnlySeason] = useState(selectedPodcast.onlySeason ? selectedPodcast.onlySeason : 'all');
	const [hideListenedEpisodes,setHideListenedEpisodes] = useState(selectedPodcast.hideListenedEpisodes ? selectedPodcast.hideListenedEpisodes : true);

	useEffect(() => {
		setSortBy(selectedPodcast.sortBy ? selectedPodcast.sortBy : 'date');
		setSortType(selectedPodcast.sortType ? selectedPodcast.sortType : 'desc');
		setOnlySeason(selectedPodcast.onlySeason ? selectedPodcast.onlySeason : 'all');
		setHideListenedEpisodes(selectedPodcast.hideListenedEpisodes ? selectedPodcast.hideListenedEpisodes : true);

	},[selectedPodcast.path]);

	useEffect(() => {
		dispatch(updatePodcastSettings(podcastInfo.path,sortBy,sortType,onlySeason,hideListenedEpisodes));
	},[sortBy,sortType,onlySeason,hideListenedEpisodes]);

	const changeSortBy = (event) => {
		var sortRaw = event.target.value;

		var newSortBy = 'date_desc';
		var newSortType = 'desc';

		[newSortBy,newSortType] = sortRaw.split('_');

		console.log(sortBy);
		console.log(sortType);

		setSortBy(newSortBy);
		setSortType(newSortType);


		
	}
	const changeOnlySeason = (event) => {
		setOnlySeason(event.target.value);
	}

	const selectEpisodeAndPlay = (episodeInfo) => {
		dispatch(playEpisode(podcastInfo,episodeInfo));
	}
	const handleHideListenedEpisodesFilter = (event) => {
		setHideListenedEpisodes(event.target.checked);
	}

	if (!episodes) {
		return (
			<div className={styles.episodeListLoading}>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
				<div className="loading-line loading-episode">&nbsp;</div>
			</div>
		);
	}

	var episodesListened = 0;
	
	var activeSeason = false;
	var seasons = [];
	
	// Let's not do this every render, but once when we mount?
	if (episodes && episodes.length > 0) {
		for(var i=0;i<episodes.length;i++) {
			if (episodes[i].season) {
				if (!seasons[episodes[i].season]) {
					seasons[episodes[i].season] = {
						seasonNumber: episodes[i].season,
						episodes: 0,
						unlistenedEpisodes: 0,
						listenedEpisodes: 0
					};
				}
			}
			if (episodes[i].listened) {
				episodesListened++;
				if (seasons[episodes[i].season]) {
					seasons[episodes[i].season].listenedEpisodes++;
					seasons[episodes[i].season].episodes++;
				}
			}
			else {
				if (seasons[episodes[i].season]) {
					seasons[episodes[i].season].unlistenedEpisodes++;
					seasons[episodes[i].season].episodes++;
				}
			}
		}
	}

	var showEpisodes = [];

	if (episodes && episodes.length > 0) {
		episodes.map((episode,index) => {
			if (seasons.length > 0 && onlySeason != 'all' && onlySeason != episode.season) {
				if (onlySeason == 'bonus' && episode.episodeType == 'bonus') {
					
				}
				else {
					return false;
				}
			}

			if (hideListenedEpisodes && episode.listened && !(activeEpisode && activeEpisode.url === episode.url)) {
				return false;
			}
			
			if (episode.season && episode.season !== activeSeason) {
				activeSeason = episode.season;
				
				/*
				if (seasons[episode.season].unlistenedEpisodes > 0) {
					episodeHTMLElements.push((
						<div className={styles.seasonHeader} key={'seasonheader' + activeSeason}>
							{ (seasons[episode.season].unlistenedEpisodes === seasons[episode.season].episodes) &&
								<>
									Season {activeSeason} <span className={styles.seasonEpisodes}>({seasons[episode.season].unlistenedEpisodes} episodes)</span>
								</>
							}
							{ (seasons[episode.season].unlistenedEpisodes !== seasons[episode.season].episodes) &&
								<>
									Season {activeSeason} <span className={styles.seasonEpisodes}>({seasons[episode.season].unlistenedEpisodes} of {seasons[episode.season].episodes} episodes left)</span>
								</>
							}
						</div>
					));
				}
				*/
			}
			showEpisodes.push(episode); 
		});
	}

	return (
		<div className={styles.episodeList}>
			{ showFilterBar &&
				<FilterBar
					seasons={seasons}
					sortBy={sortBy}
					sortType={sortType}
					changeSortBy={changeSortBy}
					onlySeason={onlySeason}
					changeOnlySeason={changeOnlySeason}
					hideListenedEpisodes={hideListenedEpisodes}
					onHideListenedEpisodes={handleHideListenedEpisodesFilter}
					episodesListened={episodesListened}
				/>
			}
			{ episodes && episodes.length == episodesListened &&
				<div style={{ padding: 60, textAlign: 'center' }} className={styles.listenedToAll}>
					<div style={{ backgroundColor: '#28bd72', width: 100, height: 100, borderRadius: '50%', display: 'flex', alignItems: 'center',justifyContent: 'center',marginLeft: 'auto',marginRight: 'auto', marginBottom: '20px' }}>
						<FaCheck size={60} style={{ color: '#FFFFFF !important' }} />
					</div>
					You listened to all the episodes in this podcast!
				</div>
			}
			{ showEpisodes.map((episode,index) => {
				var location = false;
				if (rssFeed && rssFeed.items && rssFeed.items.length) {
					for(var i=0;i<rssFeed.items.length;i++) {
						if (rssFeed.items[i].guid === episode.guid) {
							location = rssFeed.items[i].location;
						}
					}
				}

				// console.log('location: ');
				// console.log(location);

				return (
					<EpisodeListItem
						id={episode.id}
						key={episode.url}
						podcast={podcastInfo}
						podcastPath={podcastInfo.path}
						podcastTitle={podcastInfo.name}
						title={episode.title}
						description={episode.description}
						episodeImage={episode.image ? episode.image : podcastInfo.artworkUrl600 ? podcastInfo.artworkUrl600 : podcastInfo.image}
						episodeType={episode.episodeType}
						date={episode.date}
						listened={episode.listened}
						duration={episode.duration}
						currentTime={episode.currentTime}
						url={episode.url}
						episode={episode}
						location={location}
						isPlaying={isPlaying}
						isActiveEpisode={(activeEpisode && activeEpisode.url === episode.url)}
						hideListenedEpisodes={hideListenedEpisodes}
		
						
		
						selectEpisodeAndPlay={selectEpisodeAndPlay}
					/>
				);
			})}
		</div>
	);
}
/*
						isScrolling={isScrolling}
						onScroll={onChildScroll}
*/
export default EpisodeList;