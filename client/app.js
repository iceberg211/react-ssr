import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import configureStore from './store/store'
import App from './views/app'
// import { run } from './saga';

const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

const store = configureStore(initialState);
const root = document.getElementById('root')
const render = (Component) => {
  // run()
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
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
