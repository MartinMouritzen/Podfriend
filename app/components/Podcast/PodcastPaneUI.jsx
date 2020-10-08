import React from 'react';

import { connect } from "react-redux";
import { archivePodcast, unarchivePodcast } from "podfriend-approot/redux/actions/podcastActions";

import { FaArchive } from "react-icons/fa";

// import ToolTip from 'react-portal-tooltip';
import ToolTip from 'react-power-tooltip';

import EpisodeList from './EpisodeList.jsx';

import ReviewPane from 'podfriend-approot/components/Reviews/ReviewPane.jsx';

import { Tabs, Tab } from 'podfriend-approot/components/wwt/Tabs/Tabs.jsx';

import SubscribeButton from './SubscribeButton.jsx';

import styles from './PodCastPane.css';

import PodcastHeader from './PodcastHeader.jsx';
import PodcastExtras from './PodcastExtras.jsx';

/**
*
*/
class PodCastPaneUI extends React.PureComponent  {
	constructor(props) {
		super(props);
		
		this.state = {
			isArchiveTooltipActive: false
		};
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
	render() {
		return (
			<div className={styles.podcastPane}>
				<PodcastHeader
					coverImage={this.props.selectedPodcast.artworkUrl600}
					title={this.props.selectedPodcast.name}
					author={this.props.selectedPodcast.author}
					website={this.props.selectedPodcast.link}
					description={this.props.description}
					podcastLoading={this.props.podcastLoading}
					podcastLoadingError={this.props.podcastLoadingError}

				/>

				<PodcastExtras
					isSubscribed={this.props.isSubscribed}
					selectedPodcast={this.props.selectedPodcast}
					subscribedPodcasts={this.props.subscribedPodcasts}
					subscribeToPodcast={this.props.subscribeToPodcast}
					unsubscribeToPodcast={this.props.unsubscribeToPodcast}
					isArchived={this.props.isArchived}
					podcastLoadingError={this.props.podcastLoading}
					archivePodcast={archivePodcast}
					unarchivePodcast={unarchivePodcast}
				/>


				<div className={styles.podcastContent}>
					<EpisodeList currentPodcastPlaying={this.props.currentPodcastPlaying} onEpisodeSelect={this.props.onEpisodeSelect} podcastInfo={this.props.selectedPodcast} episodes={this.props.selectedPodcastEpisodes} />
					{ /*
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
					*/ }
				</div>
				{/*
					<div className={styles.headline}>Podcasts like this</div>
					<div style={{ paddingLeft: '30px', marginBottom: '30px' }}>... Coming soon!</div>
				*/}
			</div>
		);
	}
}
export default PodCastPaneUI;