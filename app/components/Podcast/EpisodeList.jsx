import React, { Component } from 'react';

import { connect } from "react-redux";
import { playEpisode, updatePodcastSettings } from "podfriend-approot/redux/actions/podcastActions";
import { audioPlayRequested } from "podfriend-approot/redux/actions/audioActions";

import { FaCheck } from 'react-icons/fa';

import EpisodeListItem from './EpisodeListItem.jsx';

import styles from './EpisodeList.css';

function mapStateToProps(state) {
	return {
		selectedPodcast: state.podcast.selectedPodcast,
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode,
		isPlaying: state.audio.isPlaying
	};
}
function mapDispatchToProps(dispatch) {
	return {
		playEpisode: (podcast,episode) => { dispatch(playEpisode(podcast,episode)); },
		audioPlayRequested: (podcast,episode) => { dispatch(audioPlayRequested(podcast,episode)); },
		updatePodcastSettings: (podcastPath,sortBy,sortType,onlySeason,hideListenedEpisodes) => { dispatch(updatePodcastSettings(podcastPath,sortBy,sortType,onlySeason,hideListenedEpisodes)); }
	};
}

/**
*
*/
class EpisodeList extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		// console.log('Look into using react-window (or react-virtualized) for the episodelist');

		console.log('EpisodeList');
		console.log(this.props.selectedPodcast);

		this.handleHideListenedEpisodesFilter = this.handleHideListenedEpisodesFilter.bind(this);
		this.selectEpisodeAndPlay = this.selectEpisodeAndPlay.bind(this);
		this.changeSortBy = this.changeSortBy.bind(this);
		this.changeOnlySeason = this.changeOnlySeason.bind(this);


		this.setEpisodeOrder = this.setEpisodeOrder.bind(this);

		this.state = {
			episodes: [],
			sortBy: this.props.selectedPodcast.sortBy ? this.props.selectedPodcast.sortBy : 'season',
			sortType: this.props.selectedPodcast.sortType ? this.props.selectedPodcast.sortType : 'asc',
			onlySeason: this.props.selectedPodcast.onlySeason ? this.props.selectedPodcast.onlySeason : 'all',
			hideListenedEpisodes: this.props.selectedPodcast.hideListenedEpisodes ? this.props.selectedPodcast.hideListenedEpisodes : true
		};
	}
	/**
	*
	*/
	setEpisodeOrder() {
		var newEpisodeOrder = this.__sort(this.props.episodes,this.state.sortBy,this.state.sortType);
		this.setState({
			episodes: newEpisodeOrder
		});
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.selectedPodcast.path !== prevProps.selectedPodcast.path) {
			this.setState({
				sortBy: this.props.selectedPodcast.sortBy ? this.props.selectedPodcast.sortBy : 'season',
				sortType: this.props.selectedPodcast.sortType ? this.props.selectedPodcast.sortType : 'asc',
				onlySeason: this.props.selectedPodcast.onlySeason ? this.props.selectedPodcast.onlySeason : 'all',
				hideListenedEpisodes: this.props.selectedPodcast.hideListenedEpisodes ? this.props.selectedPodcast.hideListenedEpisodes : true
			},() => {
				this.setEpisodeOrder();
			});
		}
	}
	/**
	*
	*/
	changeSortBy(event) {
		var sortRaw = event.target.value;

		var sortBy = 'season_asc';
		var sortType = 'asc';

		if (sortRaw == 'season_asc') {
			sortBy = 'season';
			sortType = 'asc';
		}
		else if (sortRaw == 'season_desc') {
			sortBy = 'season';
			sortType = 'desc';
		}
		else if (sortRaw == 'date_asc') {
			sortBy = 'date';
			sortType = 'asc';
		}
		else if (sortRaw == 'date_desc') {
			sortBy = 'date';
			sortType = 'desc';
		}
		else if (sortRaw == 'duration_asc') {
			sortBy = 'duration';
			sortType = 'asc';
		}
		else if (sortRaw == 'duration_desc') {
			sortBy = 'duration';
			sortType = 'desc';
		}
		this.setState({
			sortBy: sortBy,
			sortType: sortType
		},() => {
			this.setEpisodeOrder();
			this.props.updatePodcastSettings(
				this.props.selectedPodcast.path,
				this.state.sortBy,
				this.state.sortType,
				this.state.onlySeason,
				this.state.hideListenedEpisodes
			);
		});
	}
	changeOnlySeason(event) {
		this.setState({
			onlySeason: event.target.value
		},() => {
			this.props.updatePodcastSettings(
				this.props.selectedPodcast.path,
				this.state.sortBy,
				this.state.sortType,
				this.state.onlySeason,
				this.state.hideListenedEpisodes
			);
		});
	}
	/**
	*
	*/
	__sort(episodes,sortBy,sortType) {
		if (!episodes) { return false; }
		
		episodes.sort((a,b) => {
			if (sortBy === 'season') {
				var seasonA = a.season;
				var seasonB = b.season;
				
				if (seasonA == seasonB) {
					if (sortType === 'asc') {
						var sortValue = Date.parse(a.date) - Date.parse(b.date);
						if (sortValue === 0) {
							return a.title.localeCompare(b.title,{numeric: true, sensitivity: 'base'})
						}
						return sortValue;
					}
					else {
						var sortValue = Date.parse(b.date) - Date.parse(a.date);
						if (sortValue === 0) {
							return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'})
						}
						return sortValue;
					}
				}
				else {
					if (sortType === 'asc') {
						return seasonA - seasonB;
					}
					else {
						return seasonB - seasonA;
					}
				}
			}
			else if (sortBy === 'title') {
				if (sortType === 'asc') {
					return a.title.localeCompare(b.title,undefined,{numeric: true, sensitivity: 'base'});
				}
				else {
					return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'});
				}
			}
			else if (sortBy === 'date') {
				if (sortType === 'asc') {
					var sortValue = Date.parse(a.date) - Date.parse(b.date);
					if (sortValue === 0) {
						return a.title.localeCompare(b.title,{numeric: true, sensitivity: 'base'})
					}
					return sortValue;
				}
				else {
					var sortValue = Date.parse(b.date) - Date.parse(a.date);
					if (sortValue === 0) {
						return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'})
					}
					return sortValue;
				}
			}
			else if (sortBy === 'duration') {
				if (sortType === 'asc') {
					return a.duration - b.duration;
				}
				else {
					return b.duration - a.duration;
				}
			}
		});
		return episodes;
	}
	/**
	*
	*/
	selectEpisodeAndPlay(episodeInfo) {
		this.props.playEpisode(this.props.selectedPodcast,episodeInfo);
	}
	/**
	*
	*/
	handleHideListenedEpisodesFilter(event) {
		this.setState({
			hideListenedEpisodes: event.target.checked
		});
	}
	/**
	*
	*/
	render() {
		if (!this.props.episodes) {
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
		if (this.state.episodes && this.state.episodes.length > 0) {
			for(var i=0;i<this.state.episodes.length;i++) {
				if (this.state.episodes[i].season) {
					if (!seasons[this.state.episodes[i].season]) {
						seasons[this.state.episodes[i].season] = {
							seasonNumber: this.state.episodes[i].season,
							episodes: 0,
							unlistenedEpisodes: 0,
							listenedEpisodes: 0
						};
					}
				}
				if (this.state.episodes[i].listened) {
					episodesListened++;
					if (seasons[this.state.episodes[i].season]) {
						seasons[this.state.episodes[i].season].listenedEpisodes++;
						seasons[this.state.episodes[i].season].episodes++;
					}
				}
				else {
					if (seasons[this.state.episodes[i].season]) {
						seasons[this.state.episodes[i].season].unlistenedEpisodes++;
						seasons[this.state.episodes[i].season].episodes++;
					}
				}
			}
		}
		
		return (
			<div className={styles.episodeList}>
				<div className={styles.filterBar}>
					<div className={styles.filterItem}>
						<label htmlFor="sortDropDown">Sort by {this.state.sortBy}</label>
						<select id="sortDropDown" onChange={this.changeSortBy} value={this.state.sortBy + '_' + this.state.sortType}>
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
							<select id="seasonDropDown" onChange={this.changeOnlySeason} value={this.state.onlySeason}>
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
							<input type="checkbox" id="hideListenedCheckbox" checked={this.state.hideListenedEpisodes} onChange={this.handleHideListenedEpisodesFilter} /> <label className={styles.hideListenedEpisodesLabel} htmlFor='hideListenedCheckbox'>Hide {episodesListened} listened episodes</label>
						</div>
					}
				</div>
				{ this.state.episodes && this.state.episodes.length == episodesListened &&
					<div style={{ padding: 60, textAlign: 'center' }} className={styles.listenedToAll}>
						<div style={{ backgroundColor: '#28bd72', width: 100, height: 100, borderRadius: '50%', display: 'flex', alignItems: 'center',justifyContent: 'center',marginLeft: 'auto',marginRight: 'auto', marginBottom: '20px' }}>
							<FaCheck size={60} style={{ color: '#FFFFFF !important' }} />
						</div>
						You listened to all the episodes in this podcast!
					</div>
				}
				{ this.state.episodes && this.state.episodes.length > 0 &&
					this.state.episodes.map((episode,index) => {
						if (seasons.length > 0 && this.state.onlySeason != 'all' && this.state.onlySeason != episode.season) {
							if (this.state.onlySeason == 'bonus' && episode.episodeType == 'bonus') {
								
							}
							else {
								return false;
							}
						}

						var isActiveEpisode = this.props.activeEpisode && this.props.activeEpisode.url === episode.url;
						var episodeHTMLElements = [];
						
						if (episode.season && episode.season !== activeSeason) {
							activeSeason = episode.season;
							
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
						}

						episodeHTMLElements.push((
							<EpisodeListItem
								id={episode.id}
								key={episode.url}
								podcastPath={this.props.selectedPodcast.path}
								podcastTitle={this.props.selectedPodcast.name}
								title={episode.title}
								description={episode.description}
								episodeType={episode.episodeType}
								date={episode.date}
								listened={episode.listened}
								duration={episode.duration}
								currentTime={episode.currentTime}
								url={episode.url}
								episode={episode}
								isPlaying={this.props.isPlaying}
								isActiveEpisode={isActiveEpisode}
								hideListenedEpisodes={this.state.hideListenedEpisodes}

								selectEpisodeAndPlay={this.selectEpisodeAndPlay}
							/>
						));
						return episodeHTMLElements;
					})
				}
			</div>
		);
	}
}

const ConnectedEpisodeList = connect(
	mapStateToProps,
	mapDispatchToProps
)(EpisodeList);

export default ConnectedEpisodeList;