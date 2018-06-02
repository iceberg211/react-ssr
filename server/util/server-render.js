const ReactDomServer = require('react-dom/server')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper').default
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundel, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundel.createStoreMap
    const createApp = bundel.default
    const routerContext = {}
    const stores = createStoreMap()
    // client端的入口文件
    const app = createApp(stores, routerContext, req.url)
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
      resolve()
    }).catch(reject)
  })
}
