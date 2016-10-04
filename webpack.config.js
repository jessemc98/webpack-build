const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const parts = require('./libs/parts')

const merge = require('webpack-merge')
const validate = require('webpack-validator')
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'bin'),
  css: path.join(__dirname, 'src', 'style'),
  images: path.join(__dirname, 'assets', 'images')
}

const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].[chunkhash].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
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
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
       parts.extractBundle({
        name: 'vendor',
        entries: ['react', 'babel-polyfill']
      }),
      parts.loadImages(PATHS.images),
      parts.extractCSS(PATHS.css),
      parts.uglifyJs()
      // {
      //   resolve: {
      //     alias: {
      //       'react': 'react-lite',
      //       'react-dom': 'react-lite'
      //     }
      //   }
      // }
    );
    break;

  default:
    config = merge(
      common, 
      {
        devtool: 'eval-source-map'
      },
      parts.setupImages(PATHS.images),
      parts.setupCSS(PATHS.css),
      // parts.devServer({
      //   host: process.env.HOST,
      //   port: process.env.PORT
      // })
      parts.browserSync()
    );
}

module.exports = validate(config);