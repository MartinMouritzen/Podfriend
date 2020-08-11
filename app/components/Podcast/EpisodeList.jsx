import React, { Component } from 'react';

import { connect } from "react-redux";
import { playEpisode } from "podfriend-approot/redux/actions/podcastActions";
import { audioPlayRequested } from "podfriend-approot/redux/actions/audioActions";

import { ContextMenu, ContextMenuItem } from "~/app/components/wwt/ContextMenu/ContextMenu";

import { FaPlay, FaPause, FaCheck } from "react-icons/fa";
import { format, distanceInWordsToNow } from 'date-fns';
import sanitizeHtml from 'sanitize-html';
import MediaQuery  from 'react-responsive';

import Events from 'podfriend-approot/library/Events.js';
import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import ListenedImage from 'podfriend-approot/images/listened2.png';

import styles from './EpisodeList.css';

const Entities = require('html-entities').XmlEntities;

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
		
		this.state = {
			episodes: this.__sort(props.selectedPodcast.episodes,'date','asc'),
			orderBy: 'date',
			orderType: 'asc',
			hideListenedEpisodes: true
		};

		this.entities = new Entities();

		this.sortBy = this.sortBy.bind(this);
		this.handleHideListenedEpisodesFilter = this.handleHideListenedEpisodesFilter.bind(this);
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.selectedPodcast.episodes !== prevProps.selectedPodcast.episodes) {
			this.setState({
				episodes: this.__sort(this.props.selectedPodcast.episodes,'date','asc'),
				orderBy: 'date',
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
			if (orderBy === 'title') {
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
	selectEpisodeAndPlay(podcastInfo,episodeInfo) {
		this.props.playEpisode(podcastInfo,episodeInfo);
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
		if (this.state.episodes) {
			for(var i=0;i<this.state.episodes.length;i++) {
				if (this.state.episodes[i].listened) {
					episodesListened++;
				}
			}
		}
		
		return (
			<div className={styles.episodeList}>
				{ episodesListened > 0 &&
					<label><input type="checkbox" checked={this.state.hideListenedEpisodes} onChange={this.handleHideListenedEpisodesFilter} /> Hide {episodesListened} already listened episodes</label>
				}
			
			
				<MediaQuery maxWidth={590}>
					<div className={styles.mobileHeader}>
						All episodes
					</div>
				</MediaQuery>
				<MediaQuery minWidth={591}>
					<div key="header" className={styles.header}>
						<span className={styles.playHeader}>
							&nbsp;
						</span>
						<span className={styles.titleAndDescriptionHeader} onClick={() => { this.sortBy('title'); }}>
							<div className={styles.title}>
								Title
							</div>
						</span>
						<span className={styles.progressHeader}  onClick={() => { this.sortBy('progress'); }}>
							Progress
						</span>
						<span className={styles.dateHeader} onClick={() => { this.sortBy('date'); }}>
							Date
						</span>
						<span className={styles.durationHeader} onClick={() => { this.sortBy('duration'); }}>
							Duration
						</span>
					</div>
				</MediaQuery>
				<ContextMenu target={'.' + styles.episode}>
					<ContextMenuItem>Mark episode as listened</ContextMenuItem>
				</ContextMenu>
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
							var isactiveEpisode = this.props.activeEpisode && this.props.activeEpisode.url === episode.url;
							var episodeTitle = sanitizeHtml(episode.title,{
								allowedTags: []
							});
							
							// Decode entities, so that text with double encodings (eg. if it contained HTML when served to itunes, and they already encoded it) won't have encoded tags in it, when we parse it
							var description = this.entities.decode(episode.description);
							description = sanitizeHtml(description,{
								allowedTags: ['i','em']
							});
							
							var totalMinutes = Math.round(episode.duration / 60);
							var minutesLeft = episode.currentTime ? Math.round((episode.duration - episode.currentTime) / 60) : totalMinutes;
							
							var progressPercentage = episode.currentTime ? (100 * episode.currentTime) / episode.duration : 0;
							if (progressPercentage > 100) {
								progressPercentage = 100;
							}
							
							var episodeClass = styles.episode;
							if (isactiveEpisode) {
								episodeClass += ' ' + styles.episodePlaying;
							}
							if (this.props.activeEpisode && this.props.isPlaying) {
								episodeClass += ' ' + styles.isPlaying;
							}
							if (episode.listened) {
								episodeClass += ' ' + styles.listened;
							}
							
							if (!isactiveEpisode && this.state.hideListenedEpisodes && episode.listened) {
								episodeClass += ' ' + styles.hidden;
							}
							
							return (
								<div id={'episode_' + md5(episode.url)} key={index} className={episodeClass} onDoubleClick={() => { this.selectEpisodeAndPlay(this.props.selectedPodcast,episode); }}>
									<div className={styles.play}>
										<div className={[styles.playIcon,styles.icon].join(' ')}  onClick={(event) => { this.selectEpisodeAndPlay(this.props.selectedPodcast,episode); event.stopPropagation(); }}>
											<FaPlay size="13px" />
										</div>
										<div className={[styles.pauseIcon,styles.icon].join(' ')} onClick={(event) => { Events.emit('podcastPauseRequested',false); event.stopPropagation(); }}>
											<FaPause size="14px" />
										</div>
										<div className={[styles.checkIcon,styles.icon].join(' ')}>
											<FaCheck size="14px"  />
										</div>
									</div>
									<div className={styles.episodeInfo}>
										<div className={styles.titleAndDescription}>
											<div className={styles.title} dangerouslySetInnerHTML={{__html: episodeTitle}} />
											<div className={styles.date}>
												{format(episode.date,'MMM D, YYYY')}
												<span className={styles.agoText}>({distanceInWordsToNow(episode.date)} ago)</span>
											</div>
											<div className={styles.description} dangerouslySetInnerHTML={{__html:description}} />
										</div>
										<span className={styles.progress} title={('Exact episode length: ' + TimeUtil.formatPrettyDurationText(episode.duration))}>
											<div className={styles.progressBarOuter}>
												<div className={styles.progressBarInner} style={{ width: Math.round(progressPercentage) + '%' }}/>
											</div>
											
											<span className={styles.duration}>
												{ minutesLeft == totalMinutes && 
													<span>{totalMinutes} minutes</span>
												}
												{ minutesLeft != totalMinutes && 
													<span>{Math.round((episode.duration - episode.currentTime) / 60)} of {totalMinutes} minutes left</span>
												}
											</span>
											
										</span>
									</div>
								</div>
							)
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