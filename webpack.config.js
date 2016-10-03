const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const parts = require('./libs/parts')

const merge = require('webpack-merge')
const validate = require('webpack-validator')
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'bin'),
  images: path.join(__dirname, 'assets', 'images')
}

const common = {
  entry: PATHS.app + '/main.js',
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
    config = merge(
      common,
      {
        devtool: 'source-map'
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.loadImages(PATHS.images),
      parts.extractCSS(PATHS.app),
      parts.uglifyJs()
    );
    break;

  default:
    config = merge(
      common, 
      {
        devtool: 'eval-source-map'
      },
      parts.setupImages(PATHS.images),
      parts.setupCSS(PATHS.app),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);