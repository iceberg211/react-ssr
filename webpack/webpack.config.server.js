const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

// 服务端打包是从客户端读入
module.exports = {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  output: {
    // 服务端是读webpack的输出目录
    filename: 'server.entry.js',
    path: path.join(__dirname, '../dist'),
    // 前缀，区分api接口，和静态资源，加入cdn
    publicPath: '/public',
    // 使用最新的node.js模块方案，适用于
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, '../node_modules')]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      }
    ]
  }
}