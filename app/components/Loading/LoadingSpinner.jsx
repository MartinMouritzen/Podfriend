import React, { Component } from 'react';

import { RingLoader } from 'react-spinners';

/**
*
*/
function LoadingSpinner(props) {
	return (
		<div style={props.style}>
			<RingLoader color={"#FFFFFF"} size={120} />
		</div>
	);
}
export default LoadingSpinner;