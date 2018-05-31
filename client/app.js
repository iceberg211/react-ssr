import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
// import { BrowserRouter } from 'react-router-dom'
// import { Provider } from 'mobx-react'
import App from './views/app'
// import appState from './store/app-state'

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root,
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./views/app', () => {
    const NextApp = require('./views/app').default;
    render(NextApp)
  })
}
