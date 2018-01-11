const webpack = require('webpack');
const config = require('./webpack.common.config');

config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
}));
module.exports = config;