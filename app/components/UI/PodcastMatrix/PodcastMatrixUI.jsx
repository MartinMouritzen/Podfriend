import React, { Component } from 'react';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import { Link } from 'react-router-alias';

const PodcastMatrixUI = ({ podcasts = false, episodes = false, type, max = 50 }) => {
	return (
		<div className={'podcastGrid ' + type}>
		{ episodes !== false &&
			episodes.map((episode,index) => {
				if (index >= max) {
					return false;
				}
				return (
					<Link to={{ pathname: '/podcast/' + episode.path + '/' + episode.id, state: { podcast: episode } }} key={'latestPodcast' + index} className='podcastItem'>
						<PodcastImage
							podcastPath={episode.path}
							imageErrorText={episode.name}
							src={episode.image ? episode.image : episode.feedImage}
							className='cover'
							width={400}
							height={400}
						/>
						<div className='content'>
							<div className='author'>
								{episode.author}
							</div>
							<div className='title'>
								{episode.title}
							</div>
						</div>
					</Link>
				);
			})
		}
		{ podcasts !== false &&
			podcasts.map((podcast,index) => {
				if (index >= max) {
					return false;
				}
				return (
					<Link to={{ pathname: '/podcast/' + podcast.path, state: { podcast: podcast } }} key={'latestPodcast' + index} className='podcastItem'>
						<PodcastImage
							podcastPath={podcast.path}
							imageErrorText={podcast.name}
							src={podcast.artworkUrl100 ? podcast.artworkUrl100 : podcast.image}
							className='cover'
							width={400}
							height={400}
						/>
						<div className='content'>
							<div className='author'>
								{podcast.author}
							</div>
							<div className='title'>
								{podcast.name}
							</div>
						</div>
					</Link>
				);
			})
		}
		</div>
	);
}
export default React.memo(PodcastMatrixUI);