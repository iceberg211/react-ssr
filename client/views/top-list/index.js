import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import Helmet from 'react-helmet'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';


const styles = {
  root: {
    flexGrow: 1,
  },
};

@withStyles(styles)
@inject('appState') @observer
export default class TopicList extends React.Component {
  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    // do something here
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
            <Toolbar>
              <Typography variant="title" color="inherit">
                <Button variant="fab" color="primary" aria-label="add">
                  加入
                </Button>
                <Button variant="fab" color="secondary" aria-label="edit">
                  加入
                </Button>
                <Button variant="fab" disabled aria-label="delete">
                  加入
                </Button>
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
      </div>
    )
  }
}
