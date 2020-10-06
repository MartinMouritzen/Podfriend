const path = require('path');

const extraNodeModules = {
	'podfriend': path.resolve(__dirname + '/../app/components/'),
	'podfriend-redux': path.resolve(__dirname + '/../app/redux/'),
	'podfriend-storage': path.resolve(__dirname + '/library/ClientStorage.js'),
	'podfriend-root': path.resolve(__dirname + '/../'),
	'podfriend-approot': path.resolve(__dirname + '/../app/')
};
const watchFolders = [
	path.resolve(__dirname + '/../app/'),
	path.resolve(__dirname + '/../app/components/'),
	path.resolve(__dirname + '/../app/redux/'),
	path.resolve(__dirname + '/../app/library/'),
	path.resolve(__dirname + '/../app/images/'),
	path.resolve(__dirname + '/native-base-theme/'),
	path.resolve(__dirname + '/images/'),
];

module.exports = {
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: false,
			},
		}),
	}, 
	resolver: {
		sourceExts: ['jsx','js','json','ts','tsx'],
		extraNodeModules: new Proxy(extraNodeModules, {
			get: (target, name) =>
				//redirects dependencies referenced from common/ to local node_modules
				name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
		}),
	},
	watchFolders,
};