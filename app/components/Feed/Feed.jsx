import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import EpisodeCard from './EpisodeCard.jsx';

const Feed = () => {
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

	return (
		<>
			{ latestEpisodes && latestEpisodes.map((episode) => {
				return (
					<EpisodeCard episode={episode} key={episode.guid} />
				)
			} ) }
		</>
	);
};
export default Feed;