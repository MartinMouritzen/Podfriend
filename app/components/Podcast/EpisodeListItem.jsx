import React from 'react';

import { format, distanceInWordsToNow } from 'date-fns';
import DOMPurify from 'dompurify';

import { FaPlay, FaPause, FaCheck } from "react-icons/fa";

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import ShareButtons from './ShareButtons.jsx';

import styles from './EpisodeList.css';

/**
*
*/
class EpisodeListItem extends React.Component {
	constructor(props) {
		super(props);

		var episodeTitle = DOMPurify.sanitize(props.title,{
			ALLOWED_TAGS: []
		});
		
		// Decode entities, so that text with double encodings (eg. if it contained HTML when served to itunes, and they already encoded it) won't have encoded tags in it, when we parse it
		var description = DOMPurify.sanitize(props.description,{
			ALLOWED_TAGS: ['i','em']
		});
		
		this.state = {
			episodeTitle: episodeTitle,
			description: description
		};
	}
	shouldComponentUpdate(nextProps) {
		if (this.props.isActiveEpisode) { return true; }
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
			<div id={'episode-' + this.props.id} key={this.props.episode.url} className={episodeClass} onClick={() => { this.props.selectEpisodeAndPlay(this.props.episode); }}>
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
						{ this.props.episodeType && this.props.episodeType != 'full' && this.props.episodeType !== '' &&
							<span type={this.props.episodeType} className={styles.episodeType}>{this.props.episodeType}</span>
						}
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
					<ShareButtons podcastTitle={this.props.podcastTitle} episodeTitle={this.props.title} episodeId={this.props.id} podcastPath={this.props.podcastPath} />
				</div>
			</div>
		);
	}
}
export default EpisodeListItem;