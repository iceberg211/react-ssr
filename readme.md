### 基础客户端渲染

 常规的webpack配置，需要注意到在dev环境中contentBase 不能随意添加，与pulicepat相关

 webpack.base.js基本设置文件，基本的常规设置 

```
const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        use: ['eslint-loader'],
        exclude: [path.resolve(__dirname, '../node_modules')]
      },
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
```

### 开发服务器配置，通过webpackMerge复制了基本服务端

```
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
}
module.exports = config
```

使用cross-env来跨平台传递参数`dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js`,到此步才引入webpack-dev-sever,即开发服务器配置,在webpack配置文件中通过process中的参数进行判断，webpack3中dev的配置简化了很多(注意需要全局安装webpack-dev-sever).此时开发服务器读入的是build后的文件, 要注意dist目录,在开发环境的时候，webpack默认会读dist目录，可能会因为hash，到不到默认的版本出现文件404的错误
publicPath 需要和基础配置相同。
historyApiFallback   配置了很多关系，404的资源会返回到index.html

### 基础服务端渲染
```
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

  }
})
```

配置到这步的时候,在服务端读取dist(经过webpack打包过后的build文件和模板)。先读模板，然后使用ReactDOMServer.renderToString(app)得到字符串模板。再返回即可

### hot-module-replacement

保存react组件状态，避免程序刷新然后到初始状态，通过json的更新来改变,只有在开发状态需要开启热更新,真是哔了狗了，有个代码热更新一直实现不了，我重新来了，最后发现把webpack-dev-server 我装成webpack-dev了
 
webpack-dev-server开始启替换很简单，再plugins中使用
new webpack.NamedModulesPlugin(),
 new webpack.HotModuleReplacementPlugin() 

即可但是react组件要启动热替换需要安装React Hot Loader，以及在dev环境中的

```
  // 热更新
  if (module.hot) {
    module.hot.accept('./app.js', () => { render(App) })
  }

需要import { AppContainer } from 'react-hot-loader'
需要写模块判断
需要在webpack的entry入口文件中引入
```

```
config.entry = {
    app: ['react-hot-loader/patch', path.join(__dirname, '../client/app.js')]
}
注意publicpath的路径,会引起jsonUpate的路径不对
```

node.js 开发服务端环境的配置

在开发预览的时候，需要对开发服务器进行预览，免去必须build一次，然后再开启服务端渲染的问题.

一种及其hack的写发，首先在node.js服务器中导入webpack配置，然后使用webpack运行配置文件，webpack watch客户端开发环境的配置，然后使用webpack

总体的思路是使用mfs读取webpack-dev-server在内存里打包的文件，读取成字符串，然后使用node的module模块进行编译，然后暴露再render
```
const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const Memoryfs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
// 代理
const proxy = require('http-proxy-middleware')

/**
 * 大致思路是在node.js的环境种读取webpack的编译代码，这个方式过于hack
 * 可以参考社区里的实现
 */

const serverConfig = require('../../webpack/webpack.config.server')

// 拿到入口文件
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html').then(res => {
      resolve(res.data)
    }).catch(reject)
  })
}

const mfs = new Memoryfs()
// 模块的构造函数
const Module = module.constructor

let serverBundle

// 设置webpack的读写模式
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs

//  webpack的watch
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))
  // 得到路径
  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  // 使用fs读取内存种的代码
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()

  // 必须指定名字，不然报错,及其hack的写法！
  m._compile(bundle, 'server-entry.js')

  serverBundle = m.exports.default
})

module.exports = function (app) {
  // 代理请求到webpacdev上
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  // 所有的请求都返回静态结果，都在内存中
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
```

### 服务端渲染的优化(异步路由，store的同步)

目前的问题问题有 eslint和mobx的问题,已经解决eslint的版本问题

使用者可能从任意路由进入到我们的网站，所以在服务端中必须处理路由跳转，在返回给客户端的时候就指定页面，需要在服务端支持重定向
每个页面会有对应的数据，在服务端渲染的时候已经请求过对应的数据，所以要让客户端知道这些数据，在客户端渲染的时候直接使用，而不是api请求，造成浪费

- 路由跳转
当客户端代码有重定向的时候，服务端要如何处理Redirect?
StaticRouter是服务端渲染的静态路由组件，StaticRouter的context是一个js对象，记录了服务端渲染的结果，location表示 当前位置,具体可以是node.js的req.url
在客户端有重定向的时候，staticRouter的context则会被加上一个url的属性

### 开发环境暴露给服务端的入口

 在client中的暴露给服务端的入口文件，默认暴露一个function，返回了一个Provider包裹的组件
JavaScript
/*
* @param {stores} 在服务端渲染的时候，需要重新创建？ 在mobx中可以使用多个stores,避免重复渲染
* @param {routerContext} 路由信息 StaticRouter接收两个参数，一个是context，
*  静态渲染的时候的信息，假如有重定向的时候,一个是location
*  @param {url} 现在请求的url，可以通过node.js的req直接拿到
*/
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
，在node.js通过webpack.watch()的方法

在node.js的渲染逻辑中使用mfs模块读出webpack编译后的代码,使用node.js的原生模块的构造函数，然后compiler运行，得到m.exports即就是暴露的模块拿到入口方法
```
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))
  // 得到路径
  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  // 使用fs读取内存种的代码
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()

  // 必须指定名字，不然报错,及其hack的写法！
  m._compile(bundle, 'server-entry.js')

  serverBundle = m.exports.default

  // 拿到客户端中的方法
  createStoreMap = m.exports.createStoreMap
})
```

如何处理异步数据？


使用react-async-bootstrapper，在asyncBootstrap()中的方法，会先执行初始化代码才会进行其他 .
```
      asyncBootstrap(app).then(() => {
        if (routerContext.url) {
          //  如果有302
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const state = getStoreState(stores)
        const content = ReactDomServer.renderToString(app)

        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state)
        })
        res.send(html)
      })
```
使用ejs模板引擎

ejs模板，服务端获取到客户端初始状态的一些

ejs,serialize-javascript（解决在服务端初始状态为 object，object在传送中会被toString）

如何解决客户端和服务端代码不同步的问题 ?

mobx会存在多个store,实现起来逼redux略复杂

```
const getStoreState = (stores) => {
return Object.keys(stores).reduce((result, storeName) => {
  // 数据默认值的情况
  result[storeName] = stores[storeName].toJson()
  return result
}, {})

}
```


mobox的Warning的问题， there are multiple mobx instances active. This might lead to unexpected results,mobx的多次实例化

解决方法:externals: Object.keys(require('../package.json').dependencies),将类库中的代码提取出来


```
const NativeModule = require('module')
const vm = require('vm')
// `(function(exports, require, module, __finename, __dirname){ ...bundle code })`
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  // 将js代码包装成// `(function(exports, require, module, __finename, __dirname)
 //   { ...bundle code })`
  const wrapper = NativeModule.wrap(bundle)
  // 运行并
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  })
  // 执行执行环境
  const result = script.runInThisContext()
  // 让M去执行，并拿到
  result.call(m.exports, m.exports, require, m)
  return m
```

