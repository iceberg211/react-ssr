import React from 'react'
import {
  Route, Link,
} from 'react-router-dom'
import TopList from '../views/top-list'
import TopDetail from '../views/top-detail'

export default () => (
  <div>
    <ul>
      <li><Link to="/">首页</Link></li>
      <li><Link to="/about">关于</Link></li>
      <li><Link to="/topics">主题列表</Link></li>
    </ul>

    <Route exact path="/" component={TopList} />
    <Route path="/topDetail" component={TopDetail} />
  </div>
)
