import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import Helmet from 'react-helmet'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles';
import axios from 'axios'
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
  getTopics = () => {
    axios.get('/api/topics')
      .then((resp) => {
        console.log(resp)
      }).catch((err) => {
        console.log(err)
      })
  }

  login = () => {
    axios.post('/api/user/login', {
      accessToken: '8cc7a5c2-74cb-4ca3-82bf-3a7a0480e6f8',
    }).then((resp) => {
      console.log(resp)
    }).catch((err) => {
      console.log(err)
    })
  }

  markAll = () => {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then((resp) => {
        console.log(resp)
      }).catch((err) => {
        console.log(err)
      })
  }
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
                <Button variant="contained" color="primary" onClick={this.getTopics}>
                  测试话题页
                </Button>
                <Button variant="contained" color="secondary" onClick={this.login}> 登陆</Button>
                <Button variant="contained" color="secondary" onClick={this.markAll}> 测试话题页</Button>
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
      </div>
    )
  }
}
