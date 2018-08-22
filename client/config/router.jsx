import React, { Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'
import TopList from '../views/top-list'
import TopDetail from '../views/top-detail'

export default () => (
  <Fragment>
    <Route exact path="/" render={() => <Redirect to="/list" />} />
    <Route exact path="/list" component={TopList} />
    <Route path="/topDetail" component={TopDetail} />
  </Fragment>
)
