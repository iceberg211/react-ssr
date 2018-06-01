import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import App from './views/app'
import AppState from './store/app-state'


const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

console.log(initialState)
const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
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
