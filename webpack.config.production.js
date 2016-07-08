const webpack = require('webpack');

const config = {
   devtool: 'source-map',
   entry: './main.js',
   output: {
      path:'./dist/',
      filename: 'bundle.js'
   },
   plugins: [
     new webpack.optimize.DedupePlugin(),
     new webpack.optimize.UglifyJsPlugin(
         {
             output: {
               comments: false
             },
             compress: {
               warnings: false,
               screw_ie8: true
             }
           }
     )
   ],
   module: {
      loaders: [
         {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',

            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}

module.exports = config;
