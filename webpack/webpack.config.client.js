const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')


const isDev = process.env.NODE_ENV === 'development' ? true : false

const config = {
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public',
    // 前缀，区分api接口，和静态资源，加入cdn
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
  },
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
}

if (isDev) {
  config.devServer = {
    // 可以通过任何方式，最合适
    host: '0.0.0.0',
    port: '8000',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      error: true
    },
    publicPath: '/public',
    historyApiFallback: {
      index: '/public/index.html'
    }
  }
  config.plugins.push(
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  )
  config.entry = {
    app: ['react-hot-loader/patch', path.join(__dirname, '../client/app.js')],

  }
}
module.exports = config;