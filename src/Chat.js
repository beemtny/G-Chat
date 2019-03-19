import React, { Component } from "react";
import "./App.css";
import Client from "./component/Client";

export default class Chat extends Component {
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
