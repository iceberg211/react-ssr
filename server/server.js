const express = require('express')
const ReactSSR = require('react-dom/server')
const serverEnery = require('../dist/server.entry').default
const Fs = require('fs')
const path = require('path')

const template = Fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
const app = express()
// 设置静态资源目录
app.use('/public', express.static(path.join(__dirname, '../dist')))
app.get('*', function (req, res) {
  const appString = ReactSSR.renderToString(serverEnery)
  res.send(template.replace('<!-- app -->', appString))
})

app.listen(3000, function () {
  console.log('listern at  3000')
})