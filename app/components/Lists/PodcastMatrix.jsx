import React, { Component } from 'react';

import PodcastMatrixUI from 'podfriend-ui/PodcastMatrix/PodcastMatrixUI.jsx';

/**
*
*/
class PodcastMatrix extends Component {
	render() {
		return (
			<PodcastMatrixUI
				type={this.props.type}
				podcasts={this.props.podcasts}
			/>
		);
	}
}
export default PodcastMatrix;