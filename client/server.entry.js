import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './views/app'
import configureStore from './store/store'

// 因为mobx有多个sotre


export default (store, context, location) => {
  return (
    <Provider store={store}>
      <StaticRouter context={context} location={location}>
        <App />
      </StaticRouter>
    </Provider>
  )
}

export { configureStore }
