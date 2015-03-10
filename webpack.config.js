/*jslint nomen: true */
var webpack = require('webpack');

module.exports = {
    debug: true,
    devtool: '#source-map',
    context: __dirname,
    entry: './src/app',
    output: {
        publicPath: '/build/',
        path: __dirname + '/build',
        filename: 'bundle.js',
    }
};