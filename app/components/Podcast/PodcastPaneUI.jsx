import React, { Component } from 'react';

import { connect } from "react-redux";
import { archivePodcast, unarchivePodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link, withRouter } from 'react-router-dom';

import { FaArchive, FaGlobeAmericas, FaMicrophoneAlt } from "react-icons/fa";

// import ToolTip from 'react-portal-tooltip';
import ToolTip from 'react-power-tooltip';

import EpisodeList from './EpisodeList.jsx';

import SubscribeButton from './SubscribeButton.jsx';

import StarRating from './Review/StarRating.jsx';

import { FaHeart, FaHeartBroken } from "react-icons/fa";

import styles from './PodCastPane.css';

/**
*
*/
class PodCastPaneUI extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isArchiveTooltipActive: false
		};
		
		this.goToWebsite = this.goToWebsite.bind(this);
	}
	showTooltip() {
		this.setState({isArchiveTooltipActive: true})
	}
	hideTooltip() {
		this.setState({isArchiveTooltipActive: false})
	}
	/**
	*
	*/
	goToWebsite(websiteUrl) {
		var shell = require('electron').shell;
		shell.openExternal(websiteUrl);
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.podcastPane}>
				<div className={styles.mainInfo} style={{ backgroundImage: (this.props.selectedPodcast.artworkUrl600 ? 'url(' + this.props.selectedPodcast.artworkUrl600 + ')' : 'none') }}>
					<div className={styles.mainInfoInner}>
						<div>
							{ this.props.selectedPodcast.artworkUrl600 && 
								<img src={this.props.selectedPodcast.artworkUrl600} className={styles.podcastCover} draggable="false" />
							}
							{ !this.props.selectedPodcast.artworkUrl600 &&
								<div className="loading-line loading-cover">&nbsp;</div>
							}
							<div className={styles.starRating}>
								<StarRating />
							</div>
						</div>
						<div className={styles.podcastInfo}>
							<div className={styles.podcastName}>
								{this.props.selectedPodcast.name}
							</div>
							{ this.props.selectedPodcast.author &&
								<div className={styles.author}>
									<Link to={'/search/author/' + this.props.selectedPodcast.author + '/' + this.props.selectedPodcast.parentguid + '/'} className={styles.authorLink}>
										<FaMicrophoneAlt /> {this.props.selectedPodcast.author}
									</Link>
									{ false && !this.props.selectedPodcast.parentguid &&
										<div className={styles.authorLink}>
											{this.props.selectedPodcast.author}
										</div>
									}
									{ this.props.selectedPodcast.link &&
										<span>
											<span className={styles.middot}>&middot;</span>
											<span className={styles.podcastWebsiteLink} onClick={() => { this.goToWebsite(this.props.selectedPodcast.link)}}>
												<FaGlobeAmericas /> Website
											</span>
										</span>
									}
								</div>
							}
							{ this.props.podcastLoadingError &&
								<div>
									Error reading Podcast File
								</div>
							}
							
							{ !this.props.description && !this.props.podcastLoadingError && this.props.podcastLoading && 
								<div className={styles.description}>
									<div className="loading-line loading-line-long">&nbsp;</div>
									<div className="loading-line loading-line-short">&nbsp;</div>
									<div className="loading-line loading-line-mid">&nbsp;</div>
									<div className="loading-line loading-line-long">&nbsp;</div>
								</div>
							}
							{ (this.props.description || !this.props.podcastLoading) && 
								<div className={styles.description} dangerouslySetInnerHTML={{__html:this.props.description}} />
							}
							
							
							{ !this.props.podcastLoading &&
								<SubscribeButton />
							}
							
							{ !this.props.podcastLoading && !this.props.isArchived && 
								<div className={styles.archiveButton} id="archiveButton" onClick={() => { this.props.archivePodcast(this.props.selectedPodcast); }} onMouseEnter={this.showTooltip.bind(this)} onMouseLeave={this.hideTooltip.bind(this)}>
									<FaArchive /> Archive podcast
									<ToolTip show={this.state.isArchiveTooltipActive} position="bottom center" static={true} arrowAlign="center" textBoxWidth="400px" moveDown="5px">
			 							<div className={styles.toolTipText}>
									        <p>This will keep the podcast in your favorites, but you have to show archived podcasts to see it.</p>
									        <p>It's a great way to keep your lists nice and clean.</p>
									    </div>
									</ToolTip>
								</div>
							}
							{ !this.props.podcastLoading && this.props.isArchived && 
								<div className={styles.archiveButton} id="archiveButton" onClick={() => { this.props.unarchivePodcast(this.props.selectedPodcast); }} onMouseEnter={this.showTooltip.bind(this)} onMouseLeave={this.hideTooltip.bind(this)}><FaArchive /> Unarchive podcast</div>
							}

							{/*
														<ToolTip group={this.props.selectedPodcast.name} show={this.state.isArchiveTooltipActive} position="bottom" arrow="center" parent="#archiveButton">
							    <div style={{ width: '400px', paddingLeft: '20px', paddingRight: '20px'}}>
							        <p>This will keep the podcast in your favorites, but you have to show archived podcasts to see it.</p>
							        <p>It's a great way to keep your lists nice and clean.</p>
							    </div>
							</ToolTip>
							*/}
						</div>
					</div>
				</div>
					
				<div className={styles.episodeList}>
					<div className={styles.tabs}>
						<div className={styles.selectedTab}>
							Episodes <span className={styles.number}>21</span>
						</div>
						<div className={styles.tab}>
							Reviews <span className={styles.number}>2</span>
						</div>
						<div className={styles.tab}>
							Community <span className={styles.number}>3</span>
						</div>
						<div className={styles.tab}>
							Creators & Guests <span className={styles.number}>1</span>
						</div>
						<div className={styles.tab}>
							Podcast content
						</div>
					</div>
				
					{ this.props.podcastLoadingError &&
						<div>
							Error reading Podcast File
						</div>
					}
					{ !this.props.podcastLoadingError && this.props.podcastLoading && 
						<div className={styles.episodeListLoading}>
							<div className={styles.episodeListLoadingHeaders}>
								<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
								<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
								<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
								<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
							</div>
							<div className="loading-line loading-episode">&nbsp;</div>
							<div className="loading-line loading-episode">&nbsp;</div>
							<div className="loading-line loading-episode">&nbsp;</div>
							<div className="loading-line loading-episode">&nbsp;</div>
							<div className="loading-line loading-episode">&nbsp;</div>
						</div>
					}
					{ !this.props.podcastLoading && 
						<EpisodeList currentPodcastPlaying={this.props.currentPodcastPlaying} onEpisodeSelect={this.props.onEpisodeSelect} podcastInfo={this.props.selectedPodcast} episodes={this.props.selectedPodcastEpisodes} />
					}
					</div>
					<div className={styles.headline}>Podcasts like this</div>
					<div style={{ paddingLeft: '30px', marginBottom: '30px' }}>... Coming soon!</div>
			</div>
		);
	}
}
export default PodCastPaneUI;