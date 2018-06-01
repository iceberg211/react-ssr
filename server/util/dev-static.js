const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const Memoryfs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const ejs = require('ejs')
// 代理
const proxy = require('http-proxy-middleware')
// react异步请求
const asyncBootstrap = require('react-async-bootstrapper').default
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default

const NativeModule = require('module')
const vm = require('vm')
/**
 * 大致思路是在node.js的环境种读取webpack的编译代码，这个方式过于hack
 * 可以参考社区里的实现
 */
const serverConfig = require('../../webpack/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs').then(res => {
      resolve(res.data)
    }).catch(reject)
  })
}

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new Memoryfs()
// 模块的构造函数
// const Module = module.constructor

let serverBundle, createStoreMap

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

  // const m = new Module()

  // // 必须指定名字，不然报错,及其hack的写法！
  // m._compile(bundle, 'server-entry.js')
  const m = getModuleFromString(bundle, 'server-entry.js')

  serverBundle = m.exports.default
  // 拿到客户端中的方法
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = function (app) {
  // 代理请求到webpacdev上
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  // 所有的请求都返回静态结果，都在内存中
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const routerContext = {}
      const stores = createStoreMap()
      // client端的入口文件
      const app = serverBundle(stores, routerContext, req.url)
      // react 异步数据
      asyncBootstrap(app).then(() => {
        if (routerContext.url) {
          //  如果有302
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const state = getStoreState(stores)
        const helmet = Helmet.rewind()
        const content = ReactDomServer.renderToString(app)
        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
          meta: helmet.meta.toString(),
          title: helmet.meta.toString(),
          link: helmet.meta.toString(),
          style: helmet.meta.toString()
        })
        res.send(html)
      })
    })
  })
}
