import React, { useState, useEffect } from 'react';

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

const PodcastImage = React.memo(({ podcastId = false, src, width = 100, height = 100, alt = "", className = "", imageErrorText = "", fallBackImage = false, loadingComponent = false }) => {
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
					if (fallBackImage) {
						useFallbackImage();
					}
					else {
						setStatus(STATUS_ERROR);
					}
				});
			}
	}, [src, fallBackImage])

	if (status === STATUS_PRELOAD && loadingComponent) {
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
		
		const fontSize = Math.round(width / 8);

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
					fontSize: fontSize > 32 ? 32 : fontSize
				}}
				className={className}>
				{imageErrorText}
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