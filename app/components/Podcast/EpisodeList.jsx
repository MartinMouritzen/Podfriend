import React, { Component } from 'react';

import { connect } from "react-redux";
import { playEpisode, updatePodcastSettings } from "podfriend-approot/redux/actions/podcastActions";
import { audioPlayRequested } from "podfriend-approot/redux/actions/audioActions";

import { FaCheck } from 'react-icons/fa';

import FilterBar from './FilterBar.jsx';

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

		this.handleHideListenedEpisodesFilter = this.handleHideListenedEpisodesFilter.bind(this);
		this.selectEpisodeAndPlay = this.selectEpisodeAndPlay.bind(this);
		this.changeSortBy = this.changeSortBy.bind(this);
		this.changeOnlySeason = this.changeOnlySeason.bind(this);

		this.setEpisodeOrder = this.setEpisodeOrder.bind(this);

		this.state = {
			episodes: this.props.episodes,
			sortBy: this.props.selectedPodcast.sortBy ? this.props.selectedPodcast.sortBy : 'date',
			sortType: this.props.selectedPodcast.sortType ? this.props.selectedPodcast.sortType : 'desc',
			onlySeason: this.props.selectedPodcast.onlySeason ? this.props.selectedPodcast.onlySeason : 'all',
			hideListenedEpisodes: this.props.selectedPodcast.hideListenedEpisodes ? this.props.selectedPodcast.hideListenedEpisodes : true
		};

		// this.setEpisodeOrder();
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
		try {
			if ((prevProps.episodes && this.props.episodes.length !== prevProps.episodes.length) || this.props.selectedPodcast.path !== prevProps.selectedPodcast.path) {
				this.setState({
					sortBy: this.props.selectedPodcast.sortBy ? this.props.selectedPodcast.sortBy : 'date',
					sortType: this.props.selectedPodcast.sortType ? this.props.selectedPodcast.sortType : 'desc',
					onlySeason: this.props.selectedPodcast.onlySeason ? this.props.selectedPodcast.onlySeason : 'all',
					hideListenedEpisodes: this.props.selectedPodcast.hideListenedEpisodes ? this.props.selectedPodcast.hideListenedEpisodes : true
				},() => {
					this.setEpisodeOrder();
				});
			}
		}
		catch(exception) {
			console.log(exception);
			console.log(this.props.episodes);
			console.log(prevProps.episodes);
		}

		/*
		if (this.props.selectedPodcast.path !== prevProps.selectedPodcast.path) {
			this.setState({
				sortBy: this.props.selectedPodcast.sortBy ? this.props.selectedPodcast.sortBy : 'date',
				sortType: this.props.selectedPodcast.sortType ? this.props.selectedPodcast.sortType : 'desc',
				onlySeason: this.props.selectedPodcast.onlySeason ? this.props.selectedPodcast.onlySeason : 'all',
				hideListenedEpisodes: this.props.selectedPodcast.hideListenedEpisodes ? this.props.selectedPodcast.hideListenedEpisodes : true
			},() => {
				this.setEpisodeOrder();
			});
		}
		else {
			if (this.props.selectedPodcast.path === prevProps.selectedPodcast.path) {
				if (this.props.episodes.length !== prevProps.episodes.length) {
					console.log(this.props.episodes);
					console.log(prevProps.episodes);
					console.log('new episodes!');
				}
			}

		}
		*/
	}
	/**
	*
	*/
	changeSortBy(event) {
		var sortRaw = event.target.value;

		var sortBy = 'date_desc';
		var sortType = 'desc';

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
				<FilterBar
					seasons={seasons}
					sortBy={this.state.sortBy}
					sortType={this.state.sortType}
					changeSortBy={this.changeSortBy}
					onlySeason={this.state.onlySeason}
					changeOnlySeason={this.changeOnlySeason}
					hideListenedEpisodes={this.state.hideListenedEpisodes}
					hideListenedEpisodes={this.state.hideListenedEpisodes}
					onHideListenedEpisodes={this.handleHideListenedEpisodesFilter}
					episodesListened={episodesListened}
				/>
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
								podcast={this.props.podcastInfo}
								podcastPath={this.props.podcastInfo.path}
								podcastTitle={this.props.podcastInfo.name}
								title={episode.title}
								description={episode.description}
								episodeImage={episode.image ? episode.image : this.props.podcastInfo.artworkUrl600 ? this.props.podcastInfo.artworkUrl600 : this.props.podcastInfo.image}
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