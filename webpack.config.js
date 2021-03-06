const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    // new CopyWebpackPlugin([
    //   { from: './app/index.html', to: "index.html" }
    // ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
