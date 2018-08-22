import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'

// 组件库服务端渲染
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'

import App from './views/app'
import { createStoreMap } from './store/store'

// 因为mobx有多个sotre,让mobx渲染的时候不会重复的数据变换，重复调用的问题
useStaticRendering(true)

/*
 * context上的context接收一些信息，例如有重定向的时候,会在content加上一个url
 * location 为
 */
export default (stores, context, sheetsRegistry, jss, theme, location) => {
  jss.options.createGenerateClassName = createGenerateClassName
  return (
    <Provider {...stores}>
      <StaticRouter context={context} location={location}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )
}

export { createStoreMap }
