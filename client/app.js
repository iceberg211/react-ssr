import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'

import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'
import { lightBlue, pink } from 'material-ui/colors'

import App from './views/app'
import AppState from './store/app-state'


const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: pink,
    type: 'light',
  },
});

// 高阶函数
const createClientApp = (TheApp) => {
  class ClientApp extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      return <TheApp />
    }
  }

  return ClientApp
}
const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line
const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}


render(createClientApp(App))

if (module.hot) {
  module.hot.accept('./views/app', () => {
    const NextApp = require('./views/app').default;
    render(createClientApp(NextApp))
  })
}
