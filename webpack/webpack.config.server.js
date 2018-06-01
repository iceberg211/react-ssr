const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

// 服务端打包是从客户端读入
module.exports = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  output: {
    // 服务端是读webpack的输出目录
    filename: 'server.entry.js',
    // 前缀，区分api接口，和静态资源，加入cdn
    // 使用最新的node.js模块方案，适用于
    libraryTarget: 'commonjs2'
  },
  externals: Object.keys(require('../package.json').dependencies)
})
