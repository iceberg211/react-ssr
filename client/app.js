import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'

const root = document.getElementById('root')
// 在Render的时候必须进行闭合标签
ReactDOM.hydrate(<App />, root)