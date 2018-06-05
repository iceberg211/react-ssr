import React, { Component } from 'react'
import Button from 'material-ui/Button'
import axios from 'axios'

export class Test extends Component {
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
  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.getTopics}>
          测试话题页
        </Button>
        <Button variant="contained" color="secondary" onClick={this.login}> 登陆</Button>
        <Button variant="contained" color="secondary" onClick={this.markAll}> 测试话题页</Button>
      </div>
    )
  }
}

export default Test
