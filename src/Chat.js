import React, { Component } from "react";
import "./App.css";
import Message from "./Message.js";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
import GrChat from "./component/GrChat";
import man from "./pic/man.svg";
import axios from "axios";
const mongoose = require("mongoose");

// const host = "http://localhost:8000";
const host = "https://aqueous-plateau-79715.herokuapp.com";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.socket = socketIOClient(
      "https://aqueous-plateau-79715.herokuapp.com/"
    );
    // this.socket = socketIOClient('http://localhost:8000')
    this.state = {
      userName: null,
      userID: null,
      grName: null,
      isCreate: false,
      chats: [],
      joinedRooms: [],
      unJoinRooms: [],
      messages: "",
      roomId: null,
      currentRoom: null,
      currentRoomName: "ChatRoom",
      lastestRead: null,
      isLoading: false,
      newLastestRead: null
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onRoomClick = this.onRoomClick.bind(this);
    this.joinInRoom = this.joinInRoom.bind(this);
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    let createNewRoom = {
      roomName: this.state.grName,
      userID: this.state.userID
    };
    axios({
      method: "post",
      url: host + "/api/room/createroom",
      data: createNewRoom
    })
      .then(res => {
        this.fetchChatRoom();
      })
      .then(() => {
        this.setState({ isLoading: false });
      });
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    this.fetchUserData().then(() => {
      this.fetchChatRoom();
    });
  }
  //Scroll ลง

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    if (this.state.currentRoom) {
      ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
        this.refs.chats
      ).scrollHeight;
    }
  }

  fetchChatRoom() {
    axios({
      method: "get",
      url: host + "/api/room/getroomlist/?userID=" + this.state.userID
    }).then(res => {
      console.log("fetch chat room");
      const joinedRoom = res.data.data.joinedRoom.sort(function(a, b) {
        return a.room._id - b.room._id;
      });
      const unJoinRooms = res.data.data.notJoinedRoom;
      this.setState({
        joinedRooms: joinedRoom,
        unJoinRooms: unJoinRooms,
        isLoading: false
      });
    });
  }

  async fetchUserData() {
    let user = window.localStorage.getItem("userName");
    await this.setState({ userName: user });
    return axios({
      method: "get",
      url: host + "/api/user/" + this.state.userName
    }).then(async res => {
      console.log("fetch user data");
      this.setState({ userID: res.data.id });
    });
  }

  fetchMessage() {
    console.log(this.state.currentRoom);
    const data = {
      roomID: this.state.currentRoom,
      lastestReadID: this.state.lastestRead
    };
    axios({
      method: "post",
      url: host + "/api/room/fetchmessage",
      data: data
    }).then(res => {
      const messageList = res.data.data;
      let chats = [];
      messageList.map(message => {
        const isRead = message._id <= this.state.lastestRead; //calculate
        let timeStamp = mongoose.Types.ObjectId(message._id).getTimestamp();
        let time = timeStamp.getHours() + ":" + timeStamp.getMinutes();
        chats.push({
          userID: message.sender._id,
          content: <p>{message.text}</p>,
          username: message.sender.name,
          isRead: isRead,
          lastestRead: this.state.lastestRead,
          chatMessageID: time
        });
      });
      let newLastestRead = "";
      if (messageList.length > 0) {
        newLastestRead = messageList[messageList.length - 1]._id;
      }
      this.setState({
        chats: chats,
        newLastestRead: newLastestRead,
        isLoading: false
      });
      console.log(chats);
      console.log("fetch message list");
    });
  }

  componentDidMount = () => {
    this.response();
  };

  response() {
    //user ปัจจุบันที่ login
    this.socket.on("new-msg", data => {
      console.log(data);
      let timeStamp = mongoose.Types.ObjectId(data.lastestRead).getTimestamp();
      let time = timeStamp.getHours() + ":" + timeStamp.getMinutes();
      this.setState(
        {
          chats: this.state.chats.concat([
            {
              userID: data.userId,
              content: <p>{data.text}</p>,
              username: data.username,
              isRead: data.isRead,
              lastestRead: data.lastestRead,
              chatMessageID: time
            }
          ]),
          newLastestRead: data.lastestRead
        },
        () => {
          console.log("lastestRead" + this.state.newLastestRead);
        }
      );
    });
  }

  submitMessage(e) {
    e.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.msg).value;
    if (text !== "") {
      let data = {
        text: ReactDOM.findDOMNode(this.refs.msg).value,
        roomId: this.state.currentRoom,
        userId: this.state.userID,
        username: this.state.userName,
        isRead: true
      };
      this.socket.emit("message", data);
      ReactDOM.findDOMNode(this.refs.msg).value = "";
    } else {
      console.log("message not send");
    }
  }

  joinInRoom(roomID) {
    this.setState({ isLoading: true });
    let joinInRoom = {
      userID: this.state.userID,
      roomID: roomID
    };
    axios({
      method: "post",
      url: host + "/api/room/join",
      data: joinInRoom
    }).then(res => {
      this.fetchChatRoom();
      // return this.props.history.push("/chat");
    });
  }

  async updateLastesRead() {
    if (this.state.currentRoom) {
      const data = {
        userID: this.state.userID,
        roomID: this.state.currentRoom,
        lastestReadID: this.state.newLastestRead
      };
      return axios({
        method: "post",
        url: host + "/api/user/updatelatestread",
        data: data
      });
    } else {
      return axios({
        method: "get",
        url: host + "/"
      });
    }
  }

  onRoomClick(room) {
    this.setState({ isLoading: true });
    if (this.state.currentRoom) {
      this.socket.emit("leaveRoom", this.state.currentRoom);
    }
    //load message to chats
    this.updateLastesRead().then(() => {
      const roomId = room.room._id;
      const lastestRead = room.lastestRead === "" ? -1 : room.lastestRead;
      console.log(room.room.roomName);
      let currentRoomName = room.room.roomName;
      this.setState(
        {
          currentRoom: roomId,
          lastestRead: lastestRead,
          currentRoomName: currentRoomName
        },
        () => {
          console.log(this.state.currentRoom);
          this.fetchMessage();
          this.fetchChatRoom();
        }
      );
      this.socket.emit("joinRoom", roomId);
    });
  }

  onLeaveClick() {
    this.setState({ isLoading: true });
    this.socket.emit("leaveRoomPermanantly", this.state.currentRoom);
    const data = {
      userID: this.state.userID,
      roomID: this.state.currentRoom
    };
    axios({
      method: "post",
      url: host + "/api/room/leave",
      data: data
    })
      .then(res => {
        if (res.data.confirmation === "success") {
          this.fetchChatRoom();
          this.setState({ currentRoom: null });
        }
      })
      .catch(() => {
        console.log("err");
      });
  }

  render() {
    //const username = "Job"; เปลี่ยน เป็น this.state.userName
    const { chats, joinedRooms, unJoinRooms, currentRoom, grName } = this.state;
    let window = currentRoom ? (
      <div className="chatroom">
        <h3>{this.state.currentRoomName}</h3>
        <ul className="chats" ref="chats">
          {chats.map((chat, index) => (
            <Message chat={chat} user={this.state.userID} key={index} />
          ))}
        </ul>
        <form className="input" onSubmit={e => this.submitMessage(e)}>
          <input type="text" className="form-control m-1 ml-1" ref="msg" />
          <button type="submit" className="btn btn-outline-secondary m-1">
            {" "}
            Submit{" "}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger m-1"
            onClick={() => this.onLeaveClick()}
          >
            {" "}
            Leave Group{" "}
          </button>
        </form>
      </div>
    ) : (
      <img
        src="http://www.khaosodenglish.com/wp-content/uploads/2016/12/201611301704572-20061002145931.jpg"
        style={{ width: "0%", height: "0%" }}
      />
    );

    return (
      <div className="boxChat">
        <div className="block-left">
          <div className="groupSide">
            <div className="header"> Chat </div>
            <div className="row">
              <div className="col col-3">
                {" "}
                <img src={man} className="profile" />{" "}
              </div>
              <div className="col">
                <div style={{ padding: "30px 0px" }}>
                  <span style={{ fontSize: "12px" }}>username</span>
                  <br />
                  <span style={{ fontSize: "20px" }}>
                    {this.state.userName}
                  </span>
                </div>
              </div>
              <div className="col">
                <div style={{ padding: "35px 20px 0px 0px" }}>
                  <button
                    type="button"
                    className="btn createBTN"
                    data-toggle="modal"
                    data-target="#exampleModal"
                  >
                    create new group
                  </button>

                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Create New Group
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="GrName"
                                placeholder="Group name"
                                onChange={this.handleInputChange}
                                name="grName"
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="submit"
                                className="btn btn-outline-dark"
                              >
                                Create
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="groupList">
              <div className="join">
                <p className="headGroup">Joined Group</p>
                {joinedRooms.map(room => (
                  <GrChat
                    roomDetail={room}
                    onRoomClick={this.onRoomClick}
                    isJoined={true}
                    key={room.room._id}
                  />
                ))}
              </div>
              <div className="list">
                <p className="headGroup">Group List </p>
                {unJoinRooms.map(room => (
                  <GrChat
                    roomDetail={room}
                    isJoined={false}
                    onRoomClick={this.joinInRoom}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="block-right">{window}</div>
        {this.state.isLoading ? (
          <div className="Loading">
            <div className="loader " />
          </div>
        ) : null}
      </div>
    );
  }
}
