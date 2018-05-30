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

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html').then(res => {
      resolve(res.data)
    }).catch(reject)
  })
}

const mfs = new Memoryfs;
// 模块的构造函数
const Module = module.constructor

let serverBundle;

// 设置webpack的读写模式
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs

//  webpack的watch
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
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