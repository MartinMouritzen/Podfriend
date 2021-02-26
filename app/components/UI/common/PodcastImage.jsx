import React, { useState, useEffect } from 'react';

import PodcastImageFallback from './PodcastImageFallback.jsx';

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

	useEffect(() => {
		setStatus(STATUS_PRELOAD);
		setImageSource(src);
	},[podcastPath]);

	const onError = () => {
		console.log('image error1: ' + imageSource + '||| (original: ' + src + ')');
		if (fallBackImage) {
			console.log('image error2');
			if (fallBackImage == src) {
				console.log('image error3');
				setStatus(STATUS_ERROR);
			}
			else {
				setImageSource(fallBackImage);
			}
		}
		else {
			setStatus(STATUS_ERROR);
		}
	};

	const onLoad = (event) => {
		/*
		try {
			var image = event.nativeEvent.srcElement;
			var imageWidth = image.width;
			image.style.height = (imageWidth) + 'px';
		}
		catch (exception) {
			console.log('Error resizing image');
			console.log(exception);
		}
		*/
	};


	return (
		<>
			{ status === STATUS_ERROR &&
				<PodcastImageFallback
					podcastId={podcastId}
					imageSource={imageSource}
					imageErrorText={imageErrorText}
					originalSource={originalSource}
					className={className}
					isError={(status === STATUS_ERROR)}
					width={width}
				/>
			}
			{ status !== STATUS_ERROR &&
				<img
					loading="lazy"
					key={imageSource}
					src={imageSource}
					style={{

					}}
					alt={alt}
					className={className}
					onError={onError}
					onLoad={onLoad}
				/>
			}
		</>
	);

	/*
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

		if (src) {
			// Let's load the temp image
			loadImage(src)
			.then(() => {
				setStatus(STATUS_LOADED);
				setImageSource(src);
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
	}, [src, fallBackImage]);

	return (
		<>
			HELL
			{ status === STATUS_PRELOAD && loadingComponent !== false && 
				<>
					HELO1
					{loadingComponent()}
				</>
			}
			{status === STATUS_ERROR || status === STATUS_PRELOAD &&
			<>
			HELO2
				<PodcastImageFallback
					podcastId={podcastId}
					imageSource={imageSource}
					imageErrorText={imageErrorText}
					originalSource={originalSource}
					className={className}
					isError={(status === STATUS_ERROR)}
					width={width}
				/>
				</>
			}
			{ asBackground &&
			<>
			HELO3
				<div className={className} style={{ backgroundImage: 'url("' + imageSource + '")' }}>
					{children}
				</div>
				</>
			}
			{ status === STATUS_LOADED && !asBackground &&
			<>
			HELO4
				<img
					src={imageSource}
					style={{

					}}
					alt={alt}
					className={className}
				/>

				</>
			}
		</>
	);
	*/
});

export default PodcastImage;