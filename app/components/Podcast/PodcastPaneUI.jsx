import React from 'react';

import { connect } from "react-redux";
import { archivePodcast, unarchivePodcast } from "podfriend-approot/redux/actions/podcastActions";

import { Link, withRouter } from 'react-router-alias';

import { FaArchive, FaGlobeAmericas, FaMicrophoneAlt } from "react-icons/fa";

// import ToolTip from 'react-portal-tooltip';
import ToolTip from 'react-power-tooltip';

import EpisodeList from './EpisodeList.jsx';

import ReviewPane from 'podfriend-approot/components/Reviews/ReviewPane.jsx';

import { Tabs, Tab } from 'podfriend-approot/components/wwt/Tabs/Tabs.jsx';

import SubscribeButton from './SubscribeButton.jsx';

import { ReviewStarsWithText } from 'podfriend-approot/components/Reviews/StarRating.jsx';

import { FaHeart, FaHeartBroken } from "react-icons/fa";

import styles from './PodCastPane.css';

/**
*
*/
class PodCastPaneUI extends React.PureComponent  {
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
								<ReviewStarsWithText rating={4} reviews={0} />
							</div>
						</div>
						<div className={styles.podcastInfo}>
							<div className={styles.podcastName} title={this.props.selectedPodcast.name}>
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
								<div className={styles.description}>
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
								<SubscribeButton
									isSubscribed={this.props.isSubscribed}
									selectedPodcast={this.props.selectedPodcast}
									subscribedPodcasts={this.props.subscribedPodcasts}
									subscribeToPodcast={this.props.subscribeToPodcast}
									unsubscribeToPodcast={this.props.unsubscribeToPodcast}
								/>
							}
							
							{ !this.props.podcastLoading && !this.props.isArchived && this.props.isSubscribed &&
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
							{ !this.props.podcastLoading && this.props.isArchived && this.props.isSubscribed &&
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
				<div className={styles.podcastContent}>
					<Tabs>
						<Tab title="Episodes" active link={'/podcast/' + this.props.selectedPodcast.path}>
							<div className={styles.episodeTab}>
								<div className={styles.episodeColumn}>
									<EpisodeList currentPodcastPlaying={this.props.currentPodcastPlaying} onEpisodeSelect={this.props.onEpisodeSelect} podcastInfo={this.props.selectedPodcast} episodes={this.props.selectedPodcastEpisodes} />
								
									{ this.props.podcastLoadingError &&
										<div>
											Error reading Podcast File
										</div>
									}
									{ !this.props.podcastLoadingError && this.props.podcastLoading && 
										<div className={styles.episodeListLoading}>
											{/*
											<div className={styles.episodeListLoadingHeaders}>
												<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
												<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
												<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
												<div className="loading-line loading-line-very-short" style={{ marginRight: '100px' }}>&nbsp;</div>
											</div>*/}
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
									}
								</div>
								{/*
								<div className={styles.knowledgeGraph}>
									Knowledge stuff
								</div>
								*/}
							</div>
						</Tab>
						<Tab title="Reviews" link={'/podcast/' + this.props.selectedPodcast.path + '/reviews'} badge={3}>
							<ReviewPane podcast={this.props.selectedPodcast} />
						</Tab>

						<Tab title="Community" link={'/podcast/' + this.props.selectedPodcast.path + '/community'}>
							community test content
						</Tab>
						<Tab title="Lists" link={'/podcast/' + this.props.selectedPodcast.path + '/lists'}>
							Lists that feature this podcast
						</Tab>
						<Tab title="Creators & Guests" link={'/podcast/' + this.props.selectedPodcast.path + '/creators-and-guests'}>
							creator test content
						</Tab>
						<Tab title="Podcast content" link={'/podcast/' + this.props.selectedPodcast.path + '/extraContent'}>
							podcast test content
						</Tab>

					</Tabs>
				</div>
				<div className={styles.headline}>Podcasts like this</div>
				<div style={{ paddingLeft: '30px', marginBottom: '30px' }}>... Coming soon!</div>
			</div>
		);
	}
}
export default PodCastPaneUI;