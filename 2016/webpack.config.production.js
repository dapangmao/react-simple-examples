const webpack = require('webpack');

const config = {
    devtool: 'source-map',
    entry: './main.js',
    output: {
        //   path:'./dist/',
        path: 'C:\\Users\\cwr.chao.huang\\excel-uploader-backend\\static',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',

            query: {
                presets: ['es2015', 'react']
            }
        }]
    }
}

module.exports = config;
