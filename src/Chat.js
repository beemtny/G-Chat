import React, { Component } from "react";
import "./App.css";
import Message from "./Message.js";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
import GrChat from "./component/GrChat";
import man from "./pic/man.svg";
import axios from "axios";

const apiport = process.env.PORT || 8000;
const localhost = "http://localhost:" + apiport;

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.socket = socketIOClient(
      "https://aqueous-plateau-79715.herokuapp.com/"
    );
    // this.socket = socketIOClient('http://localhost:8000')
    this.state = {
      isJoin: false,
      userName: "userName",
      userID: "userID",
      grName: "grName",
      isCreate: false,
      chats: [],
      rooms: [],
      messages: "",
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

  onSubmit = async e => {
    // create room นะอิดอก
    e.preventDefault();
    let data = {
      grName: this.state.grName,
      userName: this.state.userName
    };
    this.setState({
      rooms: [...this.state.rooms, { grName: this.state.grName, messages: [] }]
    });
    axios({
      method: "get",
      url: localhost + "/api/user/" + this.state.userName
    }).then(res => {
      console.log(res.data);
      return this.props.history.push("/chat");
    });

    console.log(this.state.rooms);
    console.log(data);
    // axios({
    //   method: "get",
    //   url: localhost + "/api/database/user/" + this.state.userName
    // }).then(res => {
    //   console.log(res.data);
    // });
    // return false;
  };

  componentWillMount() {
    let user = window.localStorage.getItem("userName");
    this.setState({ userName: user }, () => {
      axios({
        method: "get",
        url: localhost + "/api/user/" + this.state.userName
      })
        .then(res => {
          this.setState({ userID: res.data.id });
        })
        .then(() => {
          console.log(this.state.userName);
          console.log(this.state.userID);
        });
    });
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
    let data = {
      text: ReactDOM.findDOMNode(this.refs.msg).value,
      userName: "123456"
    };
    this.socket.emit("chat", data);
    ReactDOM.findDOMNode(this.refs.msg).value = "";
  }

  componentDidMount = () => {
    this.response();
  };

  response = () => {
    //user ปัจจุบันที่ login
    this.socket.on("new-msg", data => {
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
  };

  render() {
    //const username = "Job"; เปลี่ยน เป็น this.state.userName
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
              <input type="text" className="form-control m-1 ml-1" ref="msg" />
              <button type="submit" className="btn btn-outline-secondary m-1">
                {" "}
                Submit{" "}
              </button>
              <button type="button" className="btn btn-outline-danger m-1">
                {" "}
                Leave Group{" "}
              </button>
            </form>
          </div>{" "}
        </div>
      </div>
    );
  }
}
