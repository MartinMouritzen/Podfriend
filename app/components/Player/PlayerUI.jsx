import React, { Component } from 'react';

import { connect } from "react-redux";

import { Link, withRouter } from 'react-router-dom';

import { FaPlay, FaPause, FaBackward, FaForward, FaFastBackward, FaFastForward, FaVolumeMute, FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";

import Range from 'react-range-progress';

import TimeUtil from './../../library/TimeUtil.js';

import styles from './../Player.scss';

import PlayLoading from './../../images/play-button-loading4.gif';

function mapStateToProps(state) {
	return {
		activePodcast: state.podcast.activePodcast,
		activeEpisode: state.podcast.activeEpisode
	};
}

/**
*
*/
class PlayerUI extends Component {
	constructor(props) {
		super(props);

		this.goToPodcast = this.goToPodcast.bind(this);
		this.onAudioElementChange = this.onAudioElementChange.bind(this);
	}
	/**
	*
	*/
	onAudioElementChange(ref) {
		this.audioElement = {
			current: ref
		}
		this.props.audioController.setAudioElement(this.audioElement);
	}
	/**
	*
	*/
	goToPodcast() {
		this.props.history.push({
			pathname: '/podcast/' + this.props.activePodcast.path,
			search: '?clickTime=' + new Date().getMilliseconds(),
			state: {
				podcast: this.props.activePodcast,
				fromPlayer: true
			}
		})
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.player}>
				<Link to={{
					pathname: '/podcast/' + this.props.activePodcast.path,
					state: {
						podcast: this.props.activePodcast,
						fromPlayer: true
					}
				}} className={styles.playing} onClick={(event) => { event.preventDefault(); this.goToPodcast() } }>
					<div className={styles.cover}>
						<img src={this.props.activePodcast.artworkUrl100} />
					</div>
					<div className={styles.playingText}>
						<div className={styles.title} dangerouslySetInnerHTML={{__html: this.props.title}} />
						<div className={styles.author}>
							{this.props.activePodcast.author}
						</div>
					</div>
				</Link>
				<div className={styles.controls}>
					<div className={styles.progress}>
						<div className={styles.progressText}>
							{TimeUtil.formatPrettyDurationText(this.props.progress)}
						</div>
						<Range
							value={(100 * this.props.progress) / this.props.duration}
							thumbSize={16}
							height={6}
							width="100%"
							fillColor={{
								r: 40,
								g: 189,
								b: 114,
								a: 1,
							}}
							trackColor={{
								r: 10,
								g: 10,
								b: 0,
								a: 0.5,
							}}
							onChange={this.props.onProgressSliderChange}
						/>
						<div className={styles.durationText} title={TimeUtil.formatPrettyDurationText(this.props.duration - this.props.progress) + ' left.'}>
							{TimeUtil.formatPrettyDurationText(this.props.duration)}
						</div>
					</div>
					<div className={styles.audioButtons}>
					<div className={styles.fastBackwardButton}>&nbsp;</div>
						<div className={styles.fastBackwardButton} onClick={this.props.onPrevEpisode}><FaFastBackward size='20px' /></div>
						<div className={styles.backwardButton} onClick={this.props.onBackward}><FaBackward size='20px' /></div>
						
						{ !this.props.canPlay &&
							<div className={styles.playButton} onClick={this.props.pause}><img src={PlayLoading} style={{ position: 'absolute', bottom: '0px', left: '0px', width: '60px', height: '60px' }}/></div>
						}
						{ this.props.canPlay && !this.props.playing &&
							<div className={styles.playButton} onClick={this.props.play}><FaPlay size='26px' /></div>
						}
						{ this.props.canPlay && this.props.playing &&
							<div className={styles.pauseButton} onClick={this.props.pause}><FaPause size='26px' /></div>
						}
						
						<div className={styles.forwardButton} onClick={this.props.onForward}><FaForward size='20px' /></div>
						<div className={styles.fastForwardButton} onClick={this.props.onNextEpisode}><FaFastForward size='20px' /></div>
						<div className={styles.fastForwardButton}><MdMoreHoriz size='20px' /></div>

						<audio
							id="player"
							style={{ display: 'none' }}
							onCanPlay={this.props.onCanPlay}
							onLoadedMetadata={this.props.onLoadedMetadata}
							controls
							ref={this.onAudioElementChange}
							onPlay={this.props.onPlay}
							onPause={this.props.onPause}
							onSeeked={this.props.onSeek}
							onTimeUpdate={(event) => { this.props.onTimeUpdate(this.props.activePodcast,event) } }
							onEnded={this.props.onEnded}
						>
							<source src={this.props.activeEpisode.url} type="audio/mpeg" />
						</audio>
					</div>
				</div>
				<div className={styles.volumeControls}>
					{ this.props.volume === 0 &&
						<FaVolumeMute size='20px' />
					}
					{ this.props.volume > 0 && this.props.volume <= 60 &&
						<FaVolumeDown size='20px' />
					}
					{ this.props.volume > 60 &&
						<FaVolumeUp size='20px' />
					}
					<Range
					  value={this.props.volume}
					  thumbSize={16}
					  height={6}
					  width="100%"
					  fillColor={{
					    r: 40,
					    g: 189,
					    b: 114,
					    a: 1,
					  }}
					  trackColor={{
					    r: 10,
					    g: 10,
					    b: 0,
					    a: 0.5,
					  }}
					  onChange={this.onVolumeSliderChange}
					/>
				</div>
			</div>
		);
	}
}

const ConnectedPlayerUI = withRouter(connect(
	mapStateToProps,
	null
)(PlayerUI));

export default ConnectedPlayerUI;