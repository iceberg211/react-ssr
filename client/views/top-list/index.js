import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux';

@connect()
export default class TopicList extends React.Component {
  componentDidMount() {
    // do something here
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(3)
        resolve(true)
      })
    })
  }


  render() {
    return (
      <div>
        <Helmet>
          <title>列表页面</title>
          <meta name="description" content="This is description" />
        </Helmet>
      </div>
    )
  }
}
