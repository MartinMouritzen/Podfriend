/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
const webpack = require('webpack');
// import { dependencies } from '../package.json';

const dependencies = require('../package.json').dependencies;

// const packageInfo = require('../package.json');
// console.log(packageInfo.dependencies);

module.exports = {
  externals: [...Object.keys(dependencies || {})],
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
      }
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
