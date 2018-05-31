import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import TopList from '../views/top-list'
import TopDetail from '../views/top-detail'

export default () => (
  <Fragment>
    <Route exact path="/" component={TopList} />
    <Route path="/topDetail" component={TopDetail} />
  </Fragment>
)
