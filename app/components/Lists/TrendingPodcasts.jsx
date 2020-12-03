import React, { useEffect, useState } from 'react';

import PodcastMatrix from './PodcastMatrix.jsx';

const TrendingPodcasts = ({ categoryId = false, subTitle = 'Trending', title = 'Podcasts', limit = 10 }) => {
	const [podcasts,setPodcasts] = useState(false);

	useEffect(() => {
		setPodcasts(false);
		const fetchTrendingPodcasts = async() => {
			const trendingAPIUrl = `https://api.podfriend.com/podcasts/trending/${categoryId ? categoryId : ''}?limit=${limit}`;
			try {
				
				let rawResults = await fetch(trendingAPIUrl);
				let results = await rawResults.json();
				setPodcasts(results);
			}
			catch(exception) {
				console.log('Error getting trending podcasts');
				console.log(trendingAPIUrl);
				console.log(exception);
			}
		};
		fetchTrendingPodcasts();
	},[]);

	if (podcasts) {
		return (
			<div className='section'>
				<div className='sectionInner'>
					<div className='sectionSubTitle'>{subTitle}</div>
					<div className='sectionTitle'>{title}</div>
				</div>
				<PodcastMatrix type='scrollList' podcasts={podcasts} showLoadMore={false} />
			</div>
		);
	}
	else {
		return null;
	}
}

export default TrendingPodcasts;