// let webpack = require('webpack');

let config = {
   devtool: 'source-map',
   entry: './main.js',
   output: {
      path:'./',
      filename: 'bundle.js'
   },
  //  plugins: [
  //    new webpack.optimize.DedupePlugin(),
  //    new webpack.optimize.UglifyJsPlugin()
  //  ],
   devServer: {
      inline: true,
      port: 8080
   },

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
