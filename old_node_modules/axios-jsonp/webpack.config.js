let webpack = require('webpack');

module.exports = {
    entry: './lib/index.js',
    output: {
        filename: './dist/index.js',
        libraryTarget: 'umd',
        library: 'axiosJsonpAdapter'
    },

    plugins: [new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
    })]
};