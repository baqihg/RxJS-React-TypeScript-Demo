const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: "./src/index.tsx",
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    publicPath: '/dist/',
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/, use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-3']
            }
          },
          "ts-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader?minimize',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer]
            }
          },
          'sass-loader'
        ],
        exclude: /node_modules/,
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      title: 'lzh'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      filename: 'vendor.js'
    })
  ],
};
