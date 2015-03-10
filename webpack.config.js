/*jslint nomen: true */
var webpack = require('webpack');

module.exports = {
    debug: true,
    devtool: '#source-map',
    context: __dirname,
    entry: './src/app',
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }
        ]
    },
    output: {
        publicPath: '/build/',
        path: __dirname + '/build',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};