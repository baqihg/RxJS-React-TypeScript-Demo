const webpack = require('webpack');
const config = require('./webpack.common.config');
config.devServer = {
  contentBase: './dist',
  hot: true,
  publicPath: config.output.publicPath,
  historyApiFallback: {
    index: '/dist/index.html'
  },
}
config.plugins.push(new webpack.HotModuleReplacementPlugin());
module.exports = config;