import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/topDetail">主题列表</Link></li>
        </ul>

        <header>标题</header>
        <Routes />
      </div>
    )
  }
}
