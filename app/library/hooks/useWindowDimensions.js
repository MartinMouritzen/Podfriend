import { useState, useEffect } from 'react';

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height
	};
}
function getOrientation() {
	return window.screen.orientation.type;
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	const updateOrientation = (event) => {
		// var orientation = getOrientation();
		setWindowDimensions(getWindowDimensions());
	}

	useEffect(() => {
		window.addEventListener('orientationchange',updateOrientation);
		return () => {
			window.removeEventListener('orientationchange',updateOrientation);
		}
	},[]);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}