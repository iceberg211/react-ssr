const ReactDomServer = require('react-dom/server')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper').default
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default

// 组件库服务端渲染
const SheetsRegistry = require('react-jss').SheetsRegistry
const colors = require('material-ui/colors')
const createMuiTheme = require('material-ui/styles').createMuiTheme
const create = require('jss').create
const preset = require('jss-preset-default').default

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

    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        secondary: colors.lightBlue,
        type: 'light'
      }
    })

    const sheetsRegistry = new SheetsRegistry()
    const jss = create(preset())

    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)
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
        style: helmet.meta.toString(),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}
