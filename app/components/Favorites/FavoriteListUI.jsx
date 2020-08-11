import React from 'react';

import { Link, withRouter } from 'react-router-alias';

import PodcastUtil from '~/app/library/PodcastUtil.js';

import styles from './../SideBar.css';

class FavoriteListUI extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

	}
	render() {
		return (
			<>
				{ this.props.subscribedPodcasts && this.props.subscribedPodcasts.length === 0 &&
					<div className={styles.noPodcastsMessage}>
						You have not added any podcasts to this category yet.<br /><br />
						Favorite a podcast, and put it in here!
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
								<img src={podcast.artworkUrl60} className={styles.cover} />
								<div className={styles.podcastDetails}>
									<span className={styles.podcastName}>{podcast.name}</span>
									<span className={styles.episodesInfo}>12 episodes, 2 new</span>
								</div>
							</Link>
							
						)
					})
				}
			</>
		);
	}
}

export default withRouter(FavoriteListUI);