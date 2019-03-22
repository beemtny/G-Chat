import React, { Component } from "react";

export default class GrChat extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { roomDetail, onRoomClick } = this.props;
    return (
      <div className="grChar">
        {this.props.isJoined ? roomDetail.room.roomName : roomDetail.roomName}
        {this.props.isJoined ? (
          <button
            type="button"
            className="btn btn-outline-info float-right ml-auto "
            onClick={() => {
              onRoomClick(roomDetail.room._id);
            }}
          >
            chat
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-success float-right ml-auto "
            onClick={() => {
              onRoomClick(roomDetail._id);
            }}
          >
            Join
          </button>
        )}
      </div>
    );
  }
}
