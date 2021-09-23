import React from 'react';

import PageHeader from './PageHeader.jsx';

const PodcastPage = ({title, children, pageType = 'contentPage'}) => {
	return (
		<div className={'podcastPage ' + pageType }>
			{ pageType === 'contentPage' &&
				<PageHeader title={title} />
			}
			{children}
		</div>
	);
};

export default PodcastPage;