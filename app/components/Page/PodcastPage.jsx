import React from 'react';

const PodcastPage = ({title, children, pageType = 'contentPage'}) => {
	return (
		<div className={'podcastPage ' + pageType }>
			{ pageType === 'contentPage' &&
				<div>
					<h1>{title}</h1>
				</div>
			}
			{children}
		</div>
	);
};

export default PodcastPage;