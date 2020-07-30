module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		["module-resolver", {
			"alias": {
				"podshare": "../app/components/",
				"react-router-alias": "react-router-native",
				"podfriend-ui": "./components/UI/"
			}
		}]
	]
};
