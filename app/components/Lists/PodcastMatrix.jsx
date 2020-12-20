import React, { Component } from 'react';

import PodcastMatrixUI from 'podfriend-ui/PodcastMatrix/PodcastMatrixUI.jsx';

/**
*
*/
const PodcastMatrix = React.memo(({type,podcasts,episodes}) => {
	return (
		<PodcastMatrixUI
			type={type}
			podcasts={podcasts}
			episodes={episodes}
		/>
	);
})
export default PodcastMatrix;