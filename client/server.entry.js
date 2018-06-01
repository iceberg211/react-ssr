import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/app'
import { createStoreMap } from './store/store'

// 因为mobx有多个sotre
useStaticRendering(true)

export default (stores, context, location) => {
  return (
    <Provider {...stores}>
      <StaticRouter context={context} location={location}>
        <App />
      </StaticRouter>
    </Provider>
  )
}

export { createStoreMap }
