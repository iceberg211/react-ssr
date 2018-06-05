import React, { Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'
import TopicList from '../views/top-list'
import TopDetail from '../views/top-detail'

export default () => (
  <Fragment>
    <Route path="/" exact render={() => <Redirect to="/index" />} key="/" />
    <Route path="/index" component={TopicList} exact key="index" />
    <Route path="/topDetail" component={TopDetail} />
  </Fragment>
)
