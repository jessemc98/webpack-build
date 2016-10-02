const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const parts = require('./libs/parts')

const merge = require('webpack-merge')
const validate = require('webpack-validator')
const PATHS = {
  app: path.join(__dirname, 'src', 'main.js'),
  build: path.join(__dirname, 'bin')
}

const common = {
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [new HtmlWebpackPlugin()]
}

let config;
// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    //minifys js for production//
    config = merge(common, {
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          }
        })
      ]
    });
    break;
  default:
    config = merge(
      common, 
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);