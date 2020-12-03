import React from 'react';

import { Link, withRouter } from 'react-router-alias';

// import PodcastUtil from '~/app/library/PodcastUtil.js';

import styles from './FavoriteListUI.scss';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

class FavoriteListUI extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

	}
	render() {
		return (
			<div className={this.props.showResponsiveList ? styles.showResponsive + ' ' + styles.favoriteList : styles.favoriteList}>
				{ this.props.subscribedPodcasts && this.props.subscribedPodcasts.length === 0 &&
					<div className={styles.noPodcastsMessage}>
						This is where your favorite podcasts will appear.<br /><br />
						Favorite a podcast, to put it in here!
					</div>
				}
				{ this.props.subscribedPodcasts && this.props.subscribedPodcasts.map((podcast,index) => {
						var isArchived = !this.props.showArchived && podcast.archived;

						var isPlaying = this.props.activePodcast && this.props.activePodcast.feedUrl == podcast.feedUrl;
						
						var podcastPath = this.props.location.pathname.substring(9);
						var subPathIndex = podcastPath.indexOf('/');
						
						if (subPathIndex !== -1) {
							podcastPath = podcastPath.substring(0,subPathIndex);
						}
						
						var isSelected = podcast.path == podcastPath;

						// var podcastInternalUrl = '/podcast/' + PodcastUtil.generatePodcastUrl(podcast.name) + '/';

						return (
							<Link to={{
									pathname: '/podcast/' + podcast.path,
									state: {
										podcast: podcast
									}
								}} className={isArchived ? styles.podcastArchived : isSelected ? styles.podcastSelected : isPlaying ? styles.podcastPlaying : styles.podcast} key={podcast.name} >
								<PodcastImage
									podcastPath={podcast.path}
									imageErrorText={podcast.name}
									src={podcast.artworkUrl100}
									className={styles.cover}
									width={120}
									height={120}
								/>
								<div className={styles.podcastDetails}>
									<span className={styles.podcastName}>{podcast.name}</span>
									{ /* <span className={styles.episodesInfo}>12 episodes, 2 new</span> */ }
								</div>
							</Link>
							
						)
					})
				}
			</div>
		);
	}
}

export default withRouter(FavoriteListUI);