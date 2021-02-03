import React, { useState,useEffect } from 'react';

import useDimensions from "react-use-dimensions";

const randomColorGen = require('randomcolor');

const PodcastImageFallback = ({ podcastId, imageSource, imageErrorText, originalSource, className, isError, width }) => {
	const [randomColor,setRandomColor] = useState('#EEEEEE');
	const [fontColor,setFontColor] = useState('#999999');
	const [fontSize,setFontSize] = useState(12);

	const [fallbackElement, { x, y, width: elementWidth }] = useDimensions();

	useEffect(() => {
		if (isError) {
			var randColor = randomColorGen({
				seed: podcastId ? podcastId : imageSource,
				luminosity: 'bright'
			});

			setRandomColor(randColor);
			setFontColor('#FFFFFF');
		}
		
		setFontSize(Math.round(width / 12));
	},[]);

	return (
		<div
			ref={fallbackElement}
			style={{
				backgroundColor: randomColor,
				padding: fontSize,
				overflow: 'hidden',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				color: fontColor,
				fontSize: fontSize > 18 ? 18 : fontSize,
				height: elementWidth
			}}
			className={className} originalsource={originalSource}>
			{imageErrorText}
		</div>
	);
};

export default PodcastImageFallback;