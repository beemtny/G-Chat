import React, { Component } from "react";

export default class GrChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoin: false
    };
  }
  render() {
   const {roomDetail, onRoomClick} = this.props;
    return (
      <div className="grChar">
        {roomDetail.room.roomName}
        {this.state.isJoin ? (
          <button
            type="button"
            className="btn btn-outline-success float-right ml-auto "
          >
            Join
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-info float-right ml-auto "
            onClick={() => { onRoomClick(roomDetail.room._id)}}
          >
            Chat
          </button>
        )}
      </div>
    );
  }
}
