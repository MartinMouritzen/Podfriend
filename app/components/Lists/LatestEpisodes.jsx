import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import PodcastMatrix from './PodcastMatrix.jsx';

const LatestVisitedPodcasts = () => {
	const subscribedPodcasts = useSelector((state) => state.podcast.subscribedPodcasts);
	const [latestEpisodes,setLatestEpisodes] = useState(false);
	const [error,setError] = useState(false);

	const retrieveLatestEpisodes = async () => {
		// console.log(subscribedPodcasts);
		var feedPaths = [];
		for(var i=0;i<subscribedPodcasts.length;i++) {
			feedPaths.push(subscribedPodcasts[i].path);
		}

		try {
			var result = await fetch('https://api.podfriend.com/podcast/episodes/?feedPaths=' + feedPaths.join(',') + '&max=14');
			var episodes = await result.json();

			if (episodes.error) {
				setError(true);
			}
			else {
				setLatestEpisodes(episodes);
			}

		}
		catch (exception) {
			console.log('Error fetching latest episodes');
			console.log(exception);
		}
	};
	
	useEffect(() => {
		retrieveLatestEpisodes();
	},[]);

	if (error) {
		return null;
	}
	return (
		<div className='section'>
			<div className='sectionInner'>
				<div className='sectionSubTitle'>Your</div>
				<div className='sectionTitle'>Latest episodes</div>
			</div>
			{ latestEpisodes !== false && 
				<PodcastMatrix type='scrollList' episodes={latestEpisodes} showLoadMore={true} />
			}
			{ latestEpisodes === false &&
				<div className="podcastGrid scrollList">
					<div className="loading-line loading-podcast-item">&nbsp;</div>
					<div className="loading-line loading-podcast-item">&nbsp;</div>
					<div className="loading-line loading-podcast-item">&nbsp;</div>
					<div className="loading-line loading-podcast-item">&nbsp;</div>
					<div className="loading-line loading-podcast-item">&nbsp;</div>
					<div className="loading-line loading-podcast-item">&nbsp;</div>
					<div className="loading-line loading-podcast-item">&nbsp;</div>
				</div>
			}
		</div>
	);
}

export default React.memo(LatestVisitedPodcasts);