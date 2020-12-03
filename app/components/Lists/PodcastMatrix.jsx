import React, { Component } from 'react';

import PodcastMatrixUI from 'podfriend-ui/PodcastMatrix/PodcastMatrixUI.jsx';

/**
*
*/
const PodcastMatrix = ({type,podcasts}) => {
	return (
		<PodcastMatrixUI
			type={type}
			podcasts={podcasts}
		/>
	);
}
export default PodcastMatrix;