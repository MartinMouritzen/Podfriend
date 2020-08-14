import React from 'react';

import { format, distanceInWordsToNow } from 'date-fns';
import sanitizeHtml from 'sanitize-html';

const md5 = require('md5');

import { FaPlay, FaPause, FaCheck } from "react-icons/fa";

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import styles from './EpisodeList.css';

/**
*
*/
class EpisodeListItem extends React.Component {
	constructor(props) {
		super(props);

		var episodeTitle = sanitizeHtml(props.title,{
			allowedTags: []
		});
		
		// Decode entities, so that text with double encodings (eg. if it contained HTML when served to itunes, and they already encoded it) won't have encoded tags in it, when we parse it
		var description = sanitizeHtml(props.description,{
			allowedTags: ['i','em']
		});
		
		var urlmd5 = md5(props.url);
		
		this.state = {
			episodeTitle: episodeTitle,
			description: description,
			urlmd5: urlmd5
		};
	}
	shouldComponentUpdate(nextProps) {
		if (nextProps.title != this.props.title) { return true; }
		if (nextProps.description != this.props.description) { return true; }
		if (nextProps.url != this.props.url) { return true; }
		if (nextProps.currentTime != this.props.currentTime) { return true; }
		if (nextProps.duration != this.props.duration) { return true; }
		if (nextProps.listened != this.props.listened) { return true; }
		if (nextProps.isActiveEpisode != this.props.isActiveEpisode) { return true; }
		if (nextProps.hideListenedEpisodes != this.props.hideListenedEpisodes) { return true; }
		if (this.props.isActiveEpisode && nextProps.isPlaying != this.props.isPlaying) { return true; }
		
		return false;
	}
	render() {
		var totalMinutes = Math.round(this.props.duration / 60);
		var minutesLeft = this.props.currentTime ? Math.round((this.props.duration - this.props.currentTime) / 60) : totalMinutes;
		
		var progressPercentage = this.props.currentTime ? (100 * this.props.currentTime) / this.props.duration : 0;
		if (progressPercentage > 100) {
			progressPercentage = 100;
		}
		
		var episodeClass = styles.episode;
		if (this.props.isActiveEpisode) {
			episodeClass += ' ' + styles.episodePlaying;
		}
		if (this.props.isActiveEpisode && this.props.isPlaying) {
			episodeClass += ' ' + styles.isPlaying;
		}
		if (this.props.listened) {
			episodeClass += ' ' + styles.listened;
		}
		
		if (!this.props.isActiveEpisode && this.props.hideListenedEpisodes && this.props.listened) {
			episodeClass += ' ' + styles.hidden;
		}
		
		return (
			<div id={'episode_' + this.state.urlmd5} key={this.props.episode.url} className={episodeClass} onDoubleClick={() => { this.props.selectEpisodeAndPlay(this.props.episode); }}>
				<div className={styles.play}>
					<div className={[styles.playIcon,styles.icon].join(' ')}  onClick={(event) => { this.props.selectEpisodeAndPlay(this.props.episode); event.stopPropagation(); }}>
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
						<div className={styles.title} dangerouslySetInnerHTML={{__html: this.state.episodeTitle}} />
						<div className={styles.date}>
							{format(this.props.date,'MMM D, YYYY')}
							<span className={styles.agoText}>({distanceInWordsToNow(this.props.date)} ago)</span>
						</div>
						<div className={styles.description} dangerouslySetInnerHTML={{__html:this.state.description}} />
					</div>
					<span className={styles.progress} title={('Exact episode length: ' + TimeUtil.formatPrettyDurationText(this.props.duration))}>
						<div className={styles.progressBarOuter}>
							<div className={styles.progressBarInner} style={{ width: Math.round(progressPercentage) + '%' }}/>
						</div>
						
						<span className={styles.duration}>
							{ minutesLeft == totalMinutes && 
								<span>{totalMinutes} minutes</span>
							}
							{ minutesLeft != totalMinutes && 
								<span>{Math.round((this.props.duration - this.props.currentTime) / 60)} of {totalMinutes} minutes left</span>
							}
						</span>
						
					</span>
				</div>
			</div>
		);
	}
}
export default EpisodeListItem;