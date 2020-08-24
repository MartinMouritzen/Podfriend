import React, { Component } from 'react';

import { connect } from "react-redux";
import { playEpisode } from "podfriend-approot/redux/actions/podcastActions";
import { audioPlayRequested } from "podfriend-approot/redux/actions/audioActions";

import { ContextMenu, ContextMenuItem } from "~/app/components/wwt/ContextMenu/ContextMenu";

import EpisodeListItem from './EpisodeListItem.jsx';

import MediaQuery  from 'react-responsive';

import Events from 'podfriend-approot/library/Events.js';

import styles from './EpisodeList.css';

const md5 = require('md5');

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
		audioPlayRequested: (podcast,episode) => { dispatch(audioPlayRequested(podcast,episode)); }
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
		
		console.log('Look into using react-window (or react-virtualized) for the episodelist');
		
		this.state = {
			episodes: this.__sort(props.selectedPodcast.episodes,'season','asc'),
			orderBy: 'season',
			orderType: 'asc',
			hideListenedEpisodes: true
		};

		this.sortBy = this.sortBy.bind(this);
		this.handleHideListenedEpisodesFilter = this.handleHideListenedEpisodesFilter.bind(this);
		this.selectEpisodeAndPlay = this.selectEpisodeAndPlay.bind(this);
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.selectedPodcast.episodes !== prevProps.selectedPodcast.episodes) {
			this.setState({
				episodes: this.__sort(this.props.selectedPodcast.episodes,'season','asc'),
				orderBy: 'season',
				orderType: 'asc'
			});
		}
	}
	/**
	*
	*/
	__sort(episodes,orderBy,orderType) {
		if (!episodes) { return false; }
		
		episodes.sort((a,b) => {
			if (orderBy === 'season') {
				var seasonA = a.season;
				var seasonB = b.season;
				
				if (seasonA == seasonB) {
					if (orderType === 'asc') {
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
					if (orderType === 'asc') {
						return seasonA - seasonB;
					}
					else {
						return seasonB - seasonA;
					}
				}
			}
			else if (orderBy === 'title') {
				if (orderType === 'asc') {
					return a.title.localeCompare(b.title,undefined,{numeric: true, sensitivity: 'base'});
				}
				else {
					return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'});
				}
			}
			else if (orderBy === 'date') {
				if (orderType === 'asc') {
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
			else if (orderBy === 'duration') {
				if (orderType === 'asc') {
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
	sortBy(header) {
		var sortedEpisodes = this.state.episodes;
		var newOrderBy = header;
		var newOrderType = this.state.orderBy !== newOrderBy ? 'asc' : this.state.orderType === 'asc' ? 'desc' : 'asc';

		sortedEpisodes = this.__sort(this.state.episodes,newOrderBy,newOrderType);
		
		this.setState({
			episodes: sortedEpisodes,
			orderBy: newOrderBy,
			orderType: newOrderType
		});
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
		var episodesListened = 0;
		
		var activeSeason = false;
		var seasons = [];
		
		// Let's not do this every render, but once when we mount?
		if (this.state.episodes) {
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
						<label for="sortDropDown">Sort by</label>
						<select id="sortDropDown">
							{ seasons.length > 0 &&
								<option value="season" selected>Season</option>
							}
							<option value="dateold">Oldest first</option>
							<option value="datenew">Newest first</option>
							<option value="durationlong">Longest first</option>
							<option value="durationshort">Shortest first</option>
						</select>
					</div>
					{ seasons.length > 0 &&
						<div className={styles.filterItem}>
							<label for="filterDropDown">Show</label>
							<select id="filterDropDown">
								<option>All seasons</option>
							{
								seasons.map((season,index) => {
									return (
										<option>Season {season.seasonNumber}</option>
									)	
								})
							}
							</select>
						</div>
					}
					{ episodesListened > 0 &&
						<div className={styles.filterItem}>
							<label><input type="checkbox" checked={this.state.hideListenedEpisodes} onChange={this.handleHideListenedEpisodesFilter} /> Hide {episodesListened} already listened episodes</label>
						</div>
					}
				</div>
			
				{/*
				<ContextMenu target={'.' + styles.episode}>
					<ContextMenuItem>Mark episode as listened</ContextMenuItem>
				</ContextMenu>
				*/}
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
						var isActiveEpisode = this.props.activeEpisode && this.props.activeEpisode.url === episode.url;
						var episodeHTMLElements = [];
						
						if (episode.season && episode.season !== activeSeason) {
							activeSeason = episode.season;
							
							if (seasons[episode.season].unlistenedEpisodes > 0) {
								episodeHTMLElements.push((
									<div className={styles.seasonHeader} key={'seasonheader' + activeSeason}>
										{ (seasons[episode.season].unlistenedEpisodes === seasons[episode.season].episodes) &&
											<>
												Season {activeSeason} ({seasons[episode.season].unlistenedEpisodes} episodes)
											</>
										}
										{ (seasons[episode.season].unlistenedEpisodes !== seasons[episode.season].episodes) &&
											<>
												Season {activeSeason} ({seasons[episode.season].unlistenedEpisodes} of {seasons[episode.season].episodes} episodes left)
											</>
										}
									</div>
								));
							}
							
							
						}

						episodeHTMLElements.push((
							<EpisodeListItem
								key={episode.url}
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