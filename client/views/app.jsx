import React, { Component, Fragment } from 'react'
import {
  withRouter,
} from 'react-router-dom'

import Routes from '../config/router'
import AppBar from './components/app-bar'
// import Container from './components/container'

class App extends Component {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    return (
      <Fragment>
        <AppBar location={this.props.location} />
        <Routes />
      </Fragment>
    )
  }
}


export default withRouter(App)
