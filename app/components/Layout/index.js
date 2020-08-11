import React from 'react';
import { Text as RNText, View } from 'react-native';

function Text(props) {
	const defaultStyle = {
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontStyle: 'normal',
		color: '#75757e'
	};
	const incomingStyle = Array.isArray(props.style) ? props.style : [props.style];
	return <RNText {...props} style={[defaultStyle, ...incomingStyle]} />;
}

export {
	Text,
	View
};