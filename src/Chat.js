import React, { Component } from "react";
import "./App.css";
import Message from "./Message.js";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
import GrChat from "./component/GrChat";
import man from "./pic/man.svg";
import axios from "axios";

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
      userName: "userName",
      userID: "userID",
      grName: "grName",
      isCreate: false,
      chats: [],
      joinedRooms: [],
      unJoinRooms: [],
      messages: "",
      roomId: null,
      currentRoom: null,
      isLoading: false
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
    // create room นะอิดอก
    e.preventDefault();
    let createNewRoom = {
      roomName: this.state.grName,
      userID: this.state.userID
    };
    console.log(createNewRoom);
    axios({
      method: "post",
      url: host + "/api/room/createroom",
      data: createNewRoom
    }).then(res => {
      console.log(res.data);
      this.fetchChatRoom();
      // return this.props.history.push("/chat");
    });

    // console.log(data);
  };

  componentWillMount() {
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
      console.log(res);
      const joinedRoom = res.data.data.joinedRoom;
      const unJoinRooms = res.data.data.notJoinedRoom;
      this.setState({ joinedRooms: joinedRoom, unJoinRooms: unJoinRooms });
      console.log(this.state.unJoinRooms);
      console.log(this.state.joinedRooms);
    });
  }

  async fetchUserData() {
    let user = window.localStorage.getItem("userName");
    await this.setState({ userName: user });
    return axios({
      method: "get",
      url: host + "/api/user/" + this.state.userName
    }).then(async res => {
      this.setState({ userID: res.data.id });
      console.log(this.state.userName);
      console.log(this.state.userID);
    });
  }

  fetchMessage() {}

  componentDidMount = () => {
    this.response();
  };

  response() {
    //user ปัจจุบันที่ login
    this.socket.on("new-msg", data => {
      console.log(data);
      this.setState(
        {
          chats: this.state.chats.concat([
            {
              username: this.state.userName,
              content: <p>{data.text}</p>
            }
          ])
        },
        () => {
          ReactDOM.findDOMNode(this.refs.msg).value = "";
        }
      );
    });
  }

  submitMessage(e) {
    e.preventDefault();
    let data = {
      text: ReactDOM.findDOMNode(this.refs.msg).value,
      roomId: this.state.currentRoom,
      userId: this.state.userID
    };
    this.socket.emit("message", data);
    ReactDOM.findDOMNode(this.refs.msg).value = "";
  }

  joinInRoom(roomID) {
    // console.log(this.state.userID);
    let joinInRoom = {
      userID: this.state.userID,
      roomID: roomID
    };
    console.log(joinInRoom);
    axios({
      method: "post",
      url: host + "/api/room/join",
      data: joinInRoom
    }).then(res => {
      console.log(res.data);
      this.fetchChatRoom();
      // return this.props.history.push("/chat");
    });
  }

  onRoomClick(roomId) {
    console.log(roomId);
    if (this.state.currentRoom) {
      this.socket.emit("leaveRoom", this.state.currentRoom);
    }
    //load message to chats
    this.setState({ currentRoom: roomId });
    this.socket.emit("joinRoom", roomId);
  }

  onLeaveClick() {
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
        <h3>ChatRoom</h3>
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
                                type="button"
                                className="btn btn-outline-danger"
                                data-dismiss="modal"
                                //onclick={}
                              >
                                Close
                              </button>
                              <button
                                type="submit"
                                className="btn btn-outline-dark"

                                //data-dismiss="modal"
                              >
                                Create
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
