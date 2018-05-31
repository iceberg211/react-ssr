const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
    // 前缀，区分api接口，和静态资源，加入cdn,注意和
  },
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
})

if (isDev) {
  config.devServer = {
    // 可以通过任何方式，最合适
    host: '0.0.0.0',
    port: '8888',
    hot: true,
    compress: true,
    overlay: {
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    }
  }
  config.plugins.push(
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  )
  config.entry = {
    app: ['react-hot-loader/patch', path.join(__dirname, '../client/app.js')]

  }
}
module.exports = config
