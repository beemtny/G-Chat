import React, { Component } from "react";
import "./App.css";
import Client from "./component/Client";

export default class Chat extends Component {
  componentWillMount() {
    console.log("componentWillMount");
  }

  //   var socket = io.connect('http://localohost:3000');

  render() {
    return (
      <div className="boxChat">
        <div className="block-left">
          <div className="header"> Chat </div>
          <Client />
        </div>
        <div className="block-right">2</div>
      </div>
    );
  }
}
