import React, { Component } from "react";
import "./App.css";
import Message from "./Message.js";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
import GrChat from "./component/GrChat";
import man from "./pic/man.svg";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    //TEST
    this.socket = socketIOClient(
      "https://aqueous-plateau-79715.herokuapp.com/"
    );
    // this.socket = socketIOClient('http://localhost:4000')
    this.state = {
      isJoin: false,
      userID: "untitle",
      grName: "GrUntitle",
      isCreate: false,
      chats: [],
      rooms:[],
      roomId: null
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  onSubmit = async e => {// create room นะอิดอก
    e.preventDefault();
    let data = {
      grName: this.state.grName,
      userID: this.state.userID
    };
    this.setState({
      rooms:[...this.state.rooms,{grName: this.state.grName ,messages: []}]
      
    })
    console.log(this.state.rooms);
    console.log(data);
    // axios({
    //   method: "get",
    //   url: localhost + "/api/database/user/" + this.state.userID
    // }).then(res => {
    //   console.log(res.data);
    // });
    // return false;
  };

  componentWillMount() {
    let user = window.localStorage.getItem("userID");
    this.setState({ userID: user }, () => console.log(this.state.userID));
  }
  //Scroll ลง

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
      this.refs.chats
    ).scrollHeight;
  }

  submitMessage(e) {
    e.preventDefault();
    this.socket.emit("chat", ReactDOM.findDOMNode(this.refs.msg).value);
  }
  leaveGroup() {
    //this.leaveGroup();
  }

  componentDidMount = () => {
    this.response();
  };

  response = () => {
    //user ปัจจุบันที่ login
    this.socket.on("new-msg", msg => {
      this.setState(
        {
          chats: this.state.chats.concat([
            {
              username: this.state.userID,
              content: <p>{msg}</p>
            }
          ])
        },
        () => {
          ReactDOM.findDOMNode(this.refs.msg).value = "";
        }
      );
    });
  };

  render() {
    
    //const username = "Job"; เปลี่ยน เป็น this.state.userID
    const { chats } = this.state;
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
                  <span style={{ fontSize: "20px" }}>{this.state.userID}</span>
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
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">
                            Create New Group
                          </h5>
                          <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form onSubmit={this.onSubmit}>
                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                id="GrName"
                                placeholder="Group name"
                                onChange={this.handleInputChange}
                                name="grName"
                              />
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn btn-outline-danger"
                                data-dismiss="modal"
                                //onclick={}
                              >
                                Close
                              </button>
                              <button
                                type="submit"
                                class="btn btn-outline-dark"
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
                <p className="headGroup">Join Group</p>
                <GrChat />
                <GrChat />
              </div>
              <div className="list">
                <p className="headGroup">Group List </p>
                <GrChat />
                <GrChat />
                <GrChat />
              </div>
            </div>
          </div>
        </div>
        <div className="block-right">
          {" "}
          <div className="chatroom">
            <h3>ChatRoom</h3>
            <ul className="chats" ref="chats">
              {chats.map(chat => (
                <Message chat={chat} user={this.state.userID} />
              ))}
            </ul>
            <form className="input" onSubmit={e => this.submitMessage(e)}>
              <input type="text" ref="msg" />
              <input type="submit" value="Submit" />
              <input type="leavegroup" value="Leave Group" />
            </form>
          </div>{" "}
        </div>
        <div className="block-right">
          {" "}
          <div className="chatroom">
            <h3>ChatRoom</h3>
            <ul className="chats" ref="chats">
              {chats.map(chat => (
                <Message chat={chat} user={this.state.userID} />
              ))}
            </ul>
            <form className="input" onSubmit={e => this.submitMessage(e)}>
              <input type="text" ref="msg" />
              <input type="submit" value="Submit" />
              <input type="leavegroup" value="LeaveGroup" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
