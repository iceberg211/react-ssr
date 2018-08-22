import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import Helmet from 'react-helmet'

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';


const styles = {
  root: {
    flexGrow: 1,
  },
};

@withStyles(styles)
@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
})
@observer
export default class TopicList extends React.Component {
  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    this.props.topicStore.fetchTopics();
  }

  // 先执行，然后再渲染，做数据的初始化工作
  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      })
    })
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value)
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <title>列表页面</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            1
          </AppBar>
        </div>
      </div>
    )
  }
}
