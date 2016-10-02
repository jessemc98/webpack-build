 module.exports = {
    entry: './src/main.js',
    output: {
      path: './bin',
      filename: 'bundle.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }
 };