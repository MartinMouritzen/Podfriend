import React from 'react';

import PodcastPage from 'podfriend-approot/components/Page/PodcastPage.jsx';

import Grid from '@material-ui/core/Grid';

const ForPodcasters = () => {
	return (
		<PodcastPage title="For Podcasters" pageType="landingPage">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<div className="hero">
						<Grid container spacing={3} alignItems="center" justify="center">
							<Grid item xs={12} lg="6" alignItems="center" justify="center">
								<h2>Website widgets</h2>
								<h1>Show your potential listeners what they can expect from your podcast</h1>
								<p>Grow your listenerbase by giving them an easy way to preview your podcast</p>
								<button>It's free</button>
								https://business.trustpilot.com/features/product-reviews
							</Grid>
							<Grid item xs={12} lg="6" alignItems="center" justify="center">
								<iframe width="400" height="400" src="https://widget.podfriend.com/#/podcast/920666?showPodcastInfo=false&amp;episodeCount=5&amp;widgetType=list&amp;primaryColor=0176e5&amp;secondaryColor=FFFFFF&amp;textColor=000000&amp;backgroundColor=FFFFFF" title="Podcast widget"></iframe>
							</Grid>
						</Grid>
					</div>
				</Grid>
			</Grid>
			<div>
				{ /*
				<iframe width="400" height="500" src="https://widget.podfriend.com/#/podcast/920666?showPodcastInfo=false&amp;episodeCount=5&amp;widgetType=list&amp;primaryColor=0176e5&amp;secondaryColor=FFFFFF&amp;textColor=000000&amp;backgroundColor=FFFFFF" title="Podcast widget"></iframe>
				*/ }
			</div>
		</PodcastPage>
	);
};

export default ForPodcasters;