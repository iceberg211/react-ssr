const ReactDomServer = require('react-dom/server')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper').default
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default

module.exports = (bundel, template, req, res) => {
  return new Promise((resolve, reject) => {
    const configureStore = bundel.configureStore
    const createApp = bundel.default
    const routerContext = {}
    const store = configureStore()

    const app = createApp(store, routerContext, req.url)
    // react 异步数据
    asyncBootstrap(app).then(() => {
      if (routerContext.url) {
        //  如果有302
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const state = store.getState()
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
