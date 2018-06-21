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
    }),
    new HtmlPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/template.ejs'),
      filename: 'server.ejs'
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
    },
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
  config.plugins.push(
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  )
  config.entry = {
    app: ['react-hot-loader/patch', path.join(__dirname, '../client/app.js')]

  }
} else {
  config.entry = {
    app: path.join(__dirname, '../client/app.js'),
    vendor: ['react', 'react-dom', 'react-router-dom', 'mobx', 'mobx-react', 'axios']
  }
  config.output.filename = '[name].[chunkhash].js'
  config.plugins.push(
    new Webpack.optimize.UglifyJsPlugin(),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'mainfest',
      minChunks: Infinity
    }),
    // 命名异步模块
    new Webpack.NamedModulesPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 给每一个模块命名，防止已数字来命名
    new Webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    })
  )
}

module.exports = config
