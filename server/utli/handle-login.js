const router = require('express').Router
const axios = require('axios')

// 代理请求
const baseUrl = 'https://cnodejs.org/api/v1 '

// 请求
router.post('/login', function (req, res) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  }).then(resp => {
    if (resp.status === 200 && resp.success) {
      req.session.user = {
        accessToken: req.body.accesstoken,
        loginName: resp.data.loginname,
        id: resp.data.id,
        avatarUrl: resp.data.avatar_url
      }
      res.json({
        success: true,
        data: resp.data
      })
    }
  }).catch(err => {
    if (err.response) {
      res.json({
        success: false,
        data: resp.data
      })
    } else {
      next(err)
    }
  })
})
