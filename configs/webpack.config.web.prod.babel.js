import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyPlugin from 'copy-webpack-plugin';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

CheckNodeEnv('production');

const productionConfig = merge.smart(baseConfig, {
	devtool: '',
	mode: 'production',
	target: 'web',
	stats: 'minimal',
	entry: path.join(__dirname, '..', 'app/index.web.js'),
	node: {
		fs: 'empty'
	},
	output: {
		path: path.join(__dirname, '..', 'release/web/'),
		publicPath: './',
		filename: 'web.[contenthash].prod.js',
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
				test: /\.(png|svg|jpg|gif)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
				}
			},
			// Extract all .global.css to style.css as is
			{
				test: /\.global\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: './'
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false
						}
					}
				]
			},
			// Pipe other styles through css modules and append to style.css
			{
				test: /^((?!\.global).)*\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localIdentName: '[name]__[local]__[hash:base64:5]',
							sourceMap: false
						}
					}
				]
			},
			// Add SASS support	- compile all .global.scss files and pipe it to style.css
			{
				test: /\.global\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							importLoaders: 1
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false
						}
					}
				]
			},
			// Add SASS support	- compile all other .scss files and pipe it to style.css
			{
				test: /^((?!\.global).)*\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: '[name]__[local]__[hash:base64:5]',
							sourceMap: false
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false
						}
					}
				]
			},
			// WOFF Font
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'file-loader'
				}
			},
			// WOFF2 Font
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'file-loader'
				}
			},
			// TTF Font
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'file-loader'
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
					loader: 'file-loader'
				}
			},
			/*
			// Common Image Formats
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
				use: 'url-loader'
			}
			*/
		]
	},

	optimization: {
		usedExports: true,
		minimizer: process.env.E2E_BUILD
			? []
			: [
					new TerserPlugin({
						parallel: true,
						sourceMap: false,
						cache: true
					}),
					new OptimizeCSSAssetsPlugin({
						cssProcessorOptions: {
							map: {
								inline: false,
								annotation: true
							}
						}
					})
				]
	},

	plugins: [
		new CopyPlugin([
			{ from: './app/web/assets/', to: path.join(__dirname, '..', 'release/web/') }
		]),
		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production'
		}),

		new MiniCssExtractPlugin({
			filename: 'style.css'
		}),
/*
		new BundleAnalyzerPlugin({
			
		}),
*/

		new HtmlWebpackPlugin({
			hash: true,
			template: './app/web/index.template.html',
			filename: 'index.html' // relative to root of the application
		})
	]
});

// Override the externals listing for web.
productionConfig.externals = ['fsevents', 'crypto-browserify'];
export default productionConfig;