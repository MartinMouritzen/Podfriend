import React, { Component } from 'react';

import { connect } from "react-redux";
import { playEpisode } from "podfriend-approot/redux/actions/podcastActions";
import { audioPlayRequested } from "podfriend-approot/redux/actions/audioActions";

import IconHandler from 'react-native-vector-icons/FontAwesome';

import EpisodeListItem from './EpisodeListItem.jsx';

import { View, Image, StyleSheet, FlatList } from 'react-native';
import { Text, Icon, Button } from 'native-base';

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
			episodes: props.selectedPodcast.episodes,
			orderBy: 'date',
			orderType: 'asc',
			hideListenedEpisodes: true,
			isMounted: false
		};

		this.sortBy = this.sortBy.bind(this);
		this.handleHideListenedEpisodesFilter = this.handleHideListenedEpisodesFilter.bind(this);
		this.selectEpisode = this.selectEpisode.bind(this);
		this.renderEpisode = this.renderEpisode.bind(this);
	}
	componentDidMount() {
		this.setState({
			episodes: this.__sort(this.props.selectedPodcast.episodes,'date','asc'),
			isMounted: true
		});
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
	selectEpisode(episodeInfo) {
		console.log(this.props.playEpisode);
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
	renderEpisode({ item }) {
		var isActiveEpisode = (this.props.activeEpisode && this.props.activeEpisode.url == item.url);

		return (
			<EpisodeListItem
				selectEpisode={this.selectEpisode}
				title={item.title}
				description={item.description}
				listened={item.listened}
				duration={item.duration}
				currentTime={item.currentTime}
				url={item.url}
				episode={item}
				isPlaying={this.props.isPlaying}
				isActiveEpisode={isActiveEpisode}
			/>
		);
	}
	__keyExtractor(item) {
		return item.url;
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
		/*
				<label><input type="checkbox" checked={this.state.hideListenedEpisodes} onChange={this.handleHideListenedEpisodesFilter} /> Hide {episodesListened} already listened episodes</label>
				
			
			
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
		*/
		if (this.state.isMounted) {
			return (
				<FlatList
					scrollEventThrottle={16}
					ListHeaderComponent={this.props.header}
			        data={this.state.episodes}
			        renderItem={this.renderEpisode}
			        keyExtractor={this.__keyExtractor}
		     	 />
	      	);
	      }
	      return (
	      	<Text>Loading</Text>
	      );
      
      
      return (
		
		
			<View>
				{ this.state.episodes &&
						this.state.episodes.map((episode,index) => {
							var isActiveEpisode = this.props.activeEpisode && this.props.activeEpisode.url === episode.url;

							
							/*
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
							*/
							
							return (
								<EpisodeListItem selectEpisode={this.selectEpisode} episode={episode} isActiveEpisode={isActiveEpisode} key={index} />
							);
							
							/*
								<div id={'episode_' + md5(episode.url)} key={index} className={episodeClass} onDoubleClick={() => { this.selectEpisode(this.props.selectedPodcast,episode,episode.title,this.props.selectedPodcast.author,this.props.selectedPodcast.artworkUrl100,episode.url,index,this.state.episodes); }}>
									<span className={styles.play}>
										<div className={[styles.playIcon,styles.icon].join(' ')}  onClick={(event) => { this.props.audioPlayRequested(this.props.selectedPodcast,episode); event.stopPropagation(); }}>
											<FaPlay size="14px" />
										</div>
										<div className={[styles.pauseIcon,styles.icon].join(' ')} onClick={(event) => { event.stopPropagation(); }}>
											<FaPause size="14px" />
										</div>
										<div className={[styles.checkIcon,styles.icon].join(' ')}>
											<FaCheck size="14px"  />
										</div>
										<div className={[styles.emptyIcon,styles.icon].join(' ')}>
											
										</div>
									</span>
									<span className={styles.titleAndDescription}>
										<div className={styles.title} dangerouslySetInnerHTML={{__html: episodeTitle}} />
										<div className={styles.description} dangerouslySetInnerHTML={{__html:description}} />
									</span>
									<span className={styles.progress}>
										<div className={styles.progressBarOuter}>
											<div className={styles.progressBarInner} style={{ width: Math.round(progressPercentage) + '%' }}/>
										</div>
									</span>
									<span className={styles.date}>
										{format(episode.date,'MMM D, YYYY')}<br />
										<span className={styles.agoText}>({distanceInWordsToNow(episode.date)} ago)</span><br />
									</span>
									<span className={styles.duration}>
										{TimeUtil.formatPrettyDurationText(episode.duration)}
									</span>
								</div>
								*/
							
						})
				}
				{ !this.state.episodes &&
					<Text>
						Loading episodes
					</Text>
				}
			</View>
		);
	}
}

const ConnectedEpisodeList = connect(
	mapStateToProps,
	mapDispatchToProps
)(EpisodeList);

export default ConnectedEpisodeList;