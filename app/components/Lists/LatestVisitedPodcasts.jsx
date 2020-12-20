import React from 'react';

import { useSelector } from "react-redux";

import PodcastMatrix from './PodcastMatrix.jsx';

const LatestVisitedPodcasts = () => {
	const lastVisitedPodcasts = useSelector((state) => state.podcast.lastVisitedPodcasts);

	if (lastVisitedPodcasts.length > 0) {
		return (
			<div className='section'>
				<div className='sectionInner'>
					<div className='sectionSubTitle'>Your</div>
					<div className='sectionTitle'>Latest podcasts</div>
				</div>
				<PodcastMatrix type='scrollList' podcasts={lastVisitedPodcasts} showLoadMore={true} />
			</div>
		);
	}
	else {
		return null;
	}
}

export default React.memo(LatestVisitedPodcasts);