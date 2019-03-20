import React, { Component } from "react";
import "../App.css";
import man from "../pic/man.svg";
import GrChat from "./GrChat";

export default class Client extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col col-3">
            {" "}
            <img src={man} className="profile" />{" "}
          </div>
          <div className="col">
            <div style={{ padding: "30px 0px" }}>
              <span style={{ fontSize: "12px" }}>username</span>
              <br />
              <span style={{ fontSize: "20px" }}>Beemtny</span>
            </div>
          </div>
          <div className="col">
            <div style={{ padding: "35px 20px 0px 0px" }}>
              <button type="button" class="btn createBTN">
                create new group
              </button>
            </div>
          </div>
        </div>
        <div className="groupList">
          <div className="join">
            <p className="headGroup">Join Group</p>
            <GrChat />
            <GrChat />
          </div>
          <div className="list">
            <p className="headGroup">Group List </p>
            <GrChat />
            <GrChat />
          </div>
        </div>
      </div>
    );
  }
}
