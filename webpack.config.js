const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const parts = require('./libs/parts')

const merge = require('webpack-merge')
const validate = require('webpack-validator')
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'bin'),
  temp: path.join(__dirname, 'tmp'),
  css: path.join(__dirname, 'src'),
  images: path.join(__dirname, 'assets', 'images')
}

const common = {
  entry: {
    app: PATHS.app
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
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
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js'
        }
      },
      {
        devtool: 'source-map'
      },
      parts.lint(PATHS.app),
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
        output: {
          path: PATHS.temp,
          filename: '[name].js'
        }
      },
      {
        devtool: 'eval-source-map'
      },
      parts.setupImages(PATHS.images),
      parts.setupCSS(PATHS.css),
      parts.lint(PATHS.app),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
