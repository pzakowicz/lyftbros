const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  entry:  "./src/index.js",
  output: {
    path: path.resolve('public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          
        }
      },
    ]
  }
};





