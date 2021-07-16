import React from 'react';



import PodcastPage from 'podfriend-approot/components/Page/PodcastPage.jsx';

import SVG from 'react-inlinesvg';
import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import Feed from 'podfriend-approot/components/Feed/Feed.jsx';

import PostForm from 'podfriend-approot/components/Feed/PostForm.jsx';

import styles from './styles.scss';
import feedPageStyles from './FeedPage.scss';
/*
const PageHeader = () => {
	return (
		<div style={{ height: '80px', bottom: '1px', overflow: 'hidden' }} >
			<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
				<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
			</svg>
		</div>
	);
};
*/
const FeedPage = () => {


	return (
		<PodcastPage title="For Podcasters" pageType="landingPage">
			<div style={{ backgroundColor: '#FFFFFF', minHeight: '100%' }}>
				{/*
				<div style={{ backgroundColor: '#FFFFFF', minHeight: '100%' }}>
					<PageHeader />
				</div>
				*/ }
				<div className={styles.pageHeader} style={{ display: 'none' }}>
					<div style={{ padding: 10 }}>
						Tab bar - button to toggle view style (some people want feed, others the normal view? others just a long list of newest episodes of what they follow)
					</div>
				</div>
				<div className={feedPageStyles.page}>
					<div className={feedPageStyles.postColumn}>
						<PostForm
							
						/>
					</div>
					<div style={{  width: '100%', maxWidth: '644px', display: 'flex', flexDirection: 'column' }}>
						<Feed />
					</div>
					<div className={feedPageStyles.rightColumn}>

					</div>
				</div>
			</div>
		</PodcastPage>
	);
};

export default FeedPage;