const path = require('path')
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common,{
  mode:'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader',
      }
    ]
  },
  {
    devServer: {
      constentBase: path.join(__dirname, 'dist'),
      port: 9000,
      hot: true
    }
  }
})
