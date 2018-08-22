const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const Memoryfs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const NativeModule = require('module')
const vm = require('vm')
const serverRendr = require('./server-render')
const serverConfig = require('../../webpack/webpack.config.server')

/**
 * 大致思路是在node.js的环境种读取webpack的编译代码，这个方式过于hack
 * 可以参考社区里的实现
 */

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs').then(res => {
      resolve(res.data)
    }).catch(reject)
  })
}
/*
** 解决requir无法从node.js模块中引入包的问题
** 将JavaScript代码包裹成node.js的模块
** `function(exports,require,module,__filename,__direname){...bundle code}`
**/
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
  // const m = new Module()
  // 必须指定名字，不然报错,及其hack的写法！
  // m._compile(bundle, 'server-entry.js')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function (app) {
  // 代理请求到webpacdev上
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  // 所有的请求都返回静态结果，都在内存中
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('正在拼命加载中')
    }
    getTemplate().then(template => {
      return serverRendr(serverBundle, template, req, res)
    }).catch(next)
  })
}
