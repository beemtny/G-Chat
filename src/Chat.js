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
      chats: [
        {
          username: "Job",
          content: <p>วัดดีคับ</p>,
          img:
            "https://scontent.fbkk12-3.fna.fbcdn.net/v/t1.0-9/38737612_1929131837146363_6837282696201240576_n.jpg?_nc_cat=102&_nc_eui2=AeHAXKjNSVqYsLNyPhzu6AKUMyIujgbE12osK6lhugNB8dM6XcR2UJN6bwdZqT_2eneGnpy6CQsmlSEfeSd5r6n2OnBmX4MLNz6cDIQeVKcMVg&_nc_ht=scontent.fbkk12-3.fna&oh=0160a70904cd1c4afb3e7a315f7ccacd&oe=5D11651E"
        },
        {
          username: "Zen",
          content: <p>วัดกะกูได้</p>,
          img:
            "https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-9/38817975_1983880531680485_703781742078590976_n.jpg?_nc_cat=109&_nc_eui2=AeES5xipaUyJQK0QaOChyO1AZOCmHBNkRgTcmc-3wpTisGPh0g-q_gDtklAstKKkv2d7sga4IyRMNr--uiYnsge7PuyGYVt4TbAddc3CBzrX5A&_nc_ht=scontent.fbkk9-2.fna&oh=ab36e66f7a88169d8f252d37bcc6e646&oe=5D036573"
        },
        {
          username: "Patja",
          content: <p>จัดเลยๆ</p>,
          img:
            "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
        },
        {
          username: "Most",
          content: <p>ใจเยนๆนะ</p>,
          img:
            "https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-9/12647440_1113114828700184_2077136073385067896_n.jpg?_nc_cat=109&_nc_eui2=AeHugNI61Z-GOiuz0EueA5kdpjfokLsTLDUKGNI3bv3IQ0irzeTCetUcVa_vaY5z1XDrCT0zeRCJ6tglql_J16ZXPHx8FU_BUcYQa8jZIGnFkA&_nc_ht=scontent.fbkk9-2.fna&oh=b2733fd429ef430f4c66ccc6d1ff87f5&oe=5D11D91B"
        },
        {
          username: "Job",
          content: <p>หลังวัดได้นะคับ</p>,
          img:
            "https://scontent.fbkk12-3.fna.fbcdn.net/v/t1.0-9/38737612_1929131837146363_6837282696201240576_n.jpg?_nc_cat=102&_nc_eui2=AeHAXKjNSVqYsLNyPhzu6AKUMyIujgbE12osK6lhugNB8dM6XcR2UJN6bwdZqT_2eneGnpy6CQsmlSEfeSd5r6n2OnBmX4MLNz6cDIQeVKcMVg&_nc_ht=scontent.fbkk12-3.fna&oh=0160a70904cd1c4afb3e7a315f7ccacd&oe=5D11651E"
        },
        {
          username: "Zen",
          content: <p>หลังวัดก็มาดิคาบ</p>,
          img:
            "https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-9/38817975_1983880531680485_703781742078590976_n.jpg?_nc_cat=109&_nc_eui2=AeES5xipaUyJQK0QaOChyO1AZOCmHBNkRgTcmc-3wpTisGPh0g-q_gDtklAstKKkv2d7sga4IyRMNr--uiYnsge7PuyGYVt4TbAddc3CBzrX5A&_nc_ht=scontent.fbkk9-2.fna&oh=ab36e66f7a88169d8f252d37bcc6e646&oe=5D036573"
        },
        {
          username: "Zen",
          content: <p>เดวเเว้นไปหา เเง้นนนนๆๆๆๆ</p>,
          img:
            "https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-9/38817975_1983880531680485_703781742078590976_n.jpg?_nc_cat=109&_nc_eui2=AeES5xipaUyJQK0QaOChyO1AZOCmHBNkRgTcmc-3wpTisGPh0g-q_gDtklAstKKkv2d7sga4IyRMNr--uiYnsge7PuyGYVt4TbAddc3CBzrX5A&_nc_ht=scontent.fbkk9-2.fna&oh=ab36e66f7a88169d8f252d37bcc6e646&oe=5D036573"
        },
        {
          username: "Beam",
          content: <p>หืมมมมม</p>,
          img:
            "https://i.kym-cdn.com/entries/icons/original/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.png"
        }
      ]
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
    e.preventDefault();
    let data = {
      grName: this.state.grName,
      userID: this.state.userID
    };
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
              username: "Job",
              content: <p>{msg}</p>,
              img:
                "https://scontent.fbkk12-3.fna.fbcdn.net/v/t1.0-9/38737612_1929131837146363_6837282696201240576_n.jpg?_nc_cat=102&_nc_eui2=AeHAXKjNSVqYsLNyPhzu6AKUMyIujgbE12osK6lhugNB8dM6XcR2UJN6bwdZqT_2eneGnpy6CQsmlSEfeSd5r6n2OnBmX4MLNz6cDIQeVKcMVg&_nc_ht=scontent.fbkk12-3.fna&oh=0160a70904cd1c4afb3e7a315f7ccacd&oe=5D11651E"
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
    const username = "Job";
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
                              >
                                Close
                              </button>
                              <button
                                type="submit"
                                class="btn btn-outline-dark"
                                // data-dismiss="modal"
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
                <Message chat={chat} user={username} />
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
                <Message chat={chat} user={username} />
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
