import React, { useState, useEffect } from 'react';
import { FaAssistiveListeningSystems } from 'react-icons/fa';

const STATUS_PRELOAD = 1;
const STATUS_LOADED = 2;
const STATUS_ERROR = -1;

const loadImage = (src) => {
	return new Promise((resolve,reject) => {
		const image = new Image(src);
		image.onerror = () => {
			return reject();
		};
		image.onload = () => {
			return resolve();
		};
		image.src = src;
	});
}

const PodcastImage = React.memo(({ podcastId = false, podcastPath = false, src, width = 100, height = 100, alt = "", className = "", imageErrorText = "", fallBackImage = false, loadingComponent = false, asBackground = false, children }) => {
	const originalSource = src;

	if (podcastPath) {
		src = 'https://podcastcovers.podfriend.com/' + podcastPath + '/' + width + 'x' + height + '/' + src;
	}

	const [status, setStatus] = useState(STATUS_PRELOAD);
	const [imageSource, setImageSource] = useState(src);

	const useFallbackImage = () => {
		// Let's load the temp image
		loadImage(fallBackImage)
		.then(() => {
			setImageSource(fallBackImage);
			setStatus(STATUS_LOADED);
		})
		.catch(() => {
			console.log('Could not load fallback image: ' + fallBackImage);
			setStatus(STATUS_ERROR);
		});
	};

	useEffect(() => {
		setStatus(STATUS_PRELOAD);
		setImageSource(src);

		if (src) {
			// Let's load the temp image
			loadImage(src)
			.then(() => {
				setStatus(STATUS_LOADED);
			})
			.catch(() => {
				console.log('Could not load: ' + src);
				if (fallBackImage) {
					useFallbackImage();
				}
				else {
					setStatus(STATUS_ERROR);
				}
			});
		}
		else {
			useFallbackImage();
		}
	}, [src, fallBackImage])

	if (status === STATUS_PRELOAD && loadingComponent !== false) {
		return loadingComponent();
	}
	else if (status === STATUS_ERROR || status === STATUS_PRELOAD) {
		var randomColor = require('randomcolor');

		var customRandomColor = '#EEEEEE';
		var fontColor = '#999999';

		if (status === STATUS_ERROR) {
			customRandomColor = randomColor({
				seed: podcastId ? podcastId : imageSource,
				luminosity: 'bright'
			});
			fontColor = '#FFFFFF';
		}
		
		const fontSize = Math.round(width / 12);

		return (
			<div
				style={{
					backgroundColor: customRandomColor,
					padding: fontSize,
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					color: fontColor,
					fontSize: fontSize > 18 ? 18 : fontSize
				}}
				className={className} originalsource={originalSource}>
				{imageErrorText}
			</div>
		);
	}
	else if (asBackground) {
		return (
			<div className={className} style={{ backgroundImage: 'url("' + imageSource + '")' }}>
				{children}
			</div>
		);
	}
	else {
		return (
			<img
				src={imageSource}
				style={{
					
				}}
				alt={alt}
				className={className}
			/>
		)
	}
});

export default PodcastImage;