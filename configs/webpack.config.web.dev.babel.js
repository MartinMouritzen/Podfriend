import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

CheckNodeEnv('development');

const port = process.env.PORT || 8080;
const publicPath = `http://localhost:${port}/`;

const devConfig = merge.smart(baseConfig, {
	devtool: 'inline-source-map',
	mode: 'development',
	target: 'web',
	entry: [
		'react-hot-loader/patch',
		`webpack-dev-server/client?http://localhost:${port}/`,
		'webpack/hot/only-dev-server',
		path.join(__dirname, '..','app/index.web.js')
	],
	output: {
		path: path.join(__dirname, '..','app/web/dist'),
		publicPath: `./`,
		filename: 'web.dev.js',
		libraryTarget: 'umd'
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true
					}
				}
			},
			{
				test: /\.global\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /^((?!\.global).)*\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							sourceMap: true,
							importLoaders: 1,
							localIdentName: '[name]__[local]__[hash:base64:5]'
						}
					}
				]
			},
			// SASS support - compile all .global.scss files and pipe it to style.css
			{
				test: /\.global\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			// SASS support - compile all other .scss files and pipe it to style.css
			{
				test: /^((?!\.global).)*\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							sourceMap: true,
							importLoaders: 1,
							localIdentName: '[name]__[local]__[hash:base64:5]'
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			// WOFF Font
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff'
					}
				}
			},
			// WOFF2 Font
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff'
					}
				}
			},
			// TTF Font
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/octet-stream'
					}
				}
			},
			// EOT Font
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				use: 'file-loader'
			},
			// SVG Font
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'image/svg+xml'
					}
				}
			},
			// Common Image Formats
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
				use: 'url-loader'
			}
		]
	},

	plugins: [
		new BundleAnalyzerPlugin(),
		new webpack.HotModuleReplacementPlugin({
			multiStep: false
		}),

		new webpack.NoEmitOnErrorsPlugin(),

		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 *
		 * By default, use 'development' as NODE_ENV. This can be overriden with
		 * 'staging', for example, by changing the ENV variables in the npm scripts
		 */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development'
		}),

		new webpack.LoaderOptionsPlugin({
			debug: true
		}),

		new HtmlWebpackPlugin({
			hash: true,
			template: './app/web/index.template.html',
			filename: 'index.html' // relative to root of the application
		})
	],

	node: {
		__dirname: false,
		__filename: false,
		fs: 'empty'
	},

	devServer: {
		host: '0.0.0.0',
		disableHostCheck: true,
		port: 8080,
		publicPath: '/',
		compress: true,
		noInfo: false,
		stats: 'errors-only',
		inline: true,
		lazy: false,
		hot: true,
		headers: { 'Access-Control-Allow-Origin': '*' },
		contentBase: path.join(__dirname,'..','app/web/assets/'),
		watchOptions: {
			aggregateTimeout: 300,
			ignored: /node_modules/,
			poll: 100
		},
		historyApiFallback: {
			verbose: true,
			disableDotRule: false
		},
		before() {
			if (process.env.START_HOT) {
				console.log('Starting Web Process...');
			}
		}
	}
});

// Override the externals listing for web.
devConfig.externals = ['fsevents', 'crypto-browserify'];
export default devConfig;