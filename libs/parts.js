const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

exports.devServer = function(options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host || '0.0.0.0', // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}
exports.browserSync = function() {
  return {
    plugins: [
      new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development, 
        // ./bin directory is being served 
        host: 'localhost',
        port: 3000,
        server: { baseDir: ['bin'] }
      })
    ]
  }
}


exports.extractCSS = function(paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.(scss|css|sass)$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
          include: paths
        }
      ]
    },
    postcss: function(){
      return [autoprefixer]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('bundle.css')
    ]
  };
}
// css-loader will resolve @import and url statements in our CSS files.
// style-loader deals with require statements in our JavaScript. 
// A similar approach works with CSS preprocessors, like Sass and Less, and their loaders.
exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(scss|css|sass)$/,
          loaders: ['style', 'css', 'sass'],
          include: paths
        }
      ]
    }
  }
}

exports.setupImages = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(jpg|png)$/,
          loader: 'url?limit=25000',
          include: paths
        },
        {
          test: /\.svg$/,
          loader: 'file?name=[path][name].[hash].[ext]',
          include: paths
        }
      ]
    }
  }
}

exports.loadImages = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'file?name=[path][name].[hash].[ext]',
          include: paths
        }
      ]
    }
  }
}

exports.uglifyJs = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin(
        {
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          }
        }
      )
    ]
  }
}

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}
