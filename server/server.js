
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const fs = require('fs')
const serverRender = require('./util/server-render')

const isDev = process.env.NODE_ENV === 'development'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'I will teach you'
}))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))
app.use(favicon(path.join(__dirname, '../favicon.ico')))

// 设置静态资源目录
if (isDev) {
  const devStatic = require('./util/dev-static')
  devStatic(app)
} else {
  const serverEntry = require('../dist/server.entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
}

app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send(err)
})

app.listen(3000, function () {
  console.log('服务端渲染开启在3000')
})
