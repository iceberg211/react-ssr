const express = require('express')
const ReactSSR = require('react-dom/server')
// const serverEnery = require('../dist/server.entry').default
const Fs = require('fs')
const path = require('path')

const template = Fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')

const isDev = process.env.NODE_ENV === 'development' ? true : false

const app = express()
// 设置静态资源目录
app.use('/public', express.static(path.join(__dirname, '../dist')))

if (isDev) {
  const devStatic = require('./utli/dev-static')
  devStatic(app)
} else {
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEnery)
    res.send(template.replace('<!-- app -->', appString))
  })
}


app.listen(3000, function () {
  console.log('服务端渲染开启在3000')
}) 