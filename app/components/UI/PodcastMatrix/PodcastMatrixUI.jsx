import React, { Component } from 'react';

import { FaHeart } from "react-icons/fa";

import { Link } from 'react-router-dom';

import styles from './PodcastMatrixUI.css';

/**
*
*/
class PodcastMatrix extends Component {
	render() {
		return (
			<div>
			{
				this.props.podcasts.map((podcast,index) => {
					if (index >= 5) {
						return false;
					}
					return (
						<Link to={{ pathname: '/podcast/' + podcast.path, state: { podcast: podcast } }} key={'latestPodcast' + index} className={styles.searchResult}>
							<div style={{ backgroundImage: 'url(' + podcast.artworkUrl600 + ')' }} className={styles.thumbNail}>
								<div className={styles.subscribe} onClick={(event) => { event.stopPropagation(); this.props.onSubscribe(podcast); }}>
									<FaHeart />
								</div>
							</div>
							<div className={styles.content}>
								<div className={styles.author}>
									{podcast.author}
								</div>
								<div className={styles.podcastTitle}>
									{podcast.podcastName}
								</div>
							</div>
						</Link>
					);
				})
			}
			</div>
		);
	}
}
export default PodcastMatrix;