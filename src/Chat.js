import React, { Component } from "react";
import "./App.css";
import Client from "./component/Client";
import socketIOClient from 'socket.io-client'
import io from "socket.io-client";

export default class Chat extends Component {

  constructor(props){
    super(props)
    this.state = {msg: 'no msg'}
  }

  componentDidMount = () => {
    this.response()
  }

  send = (message) => {
    let socket = socketIOClient('http://localhost:4000')
    // let socket = io('https://aqueous-plateau-79715.herokuapp.com/')
    socket.emit('msg', 'message')
  }

  response = () => {
    let socket = socketIOClient('http://localhost:4000')
    // let socket = io('https://aqueous-plateau-79715.herokuapp.com/')
    socket.on('new-msg', (msg) => {
      this.setState({ msg: msg })
      console.log(msg)
    })
  }

  render() {
    return (
      <div className="boxChat">
        <div className="block-left">
          <Client />
        </div>
        <div className="block-right">2</div>
      </div>
    );
  }
}
