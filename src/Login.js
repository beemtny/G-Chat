import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import "./App.css";
import axios from "axios";

// const host = "https://aqueous-plateau-79715.herokuapp.com";
const host = "http://192.168.43.27:8080";
// const host = "http://localhost:8000";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pass: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
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
    window.localStorage.setItem("userName", this.state.userName);
    axios({
      method: "get",
      url: host + "/api/user/" + this.state.userName
    }).then(res => {
      console.log(res.data);
      return this.props.history.push("/chat");
    });
  };

  render() {
    return (
      <div>
        <MDBContainer>
          <MDBRow>
            <MDBCol className="mt-4">
              <form className="login" onSubmit={this.onSubmit}>
                <p className="h4 text-center mb-4" style={{ fontSize: "50px" }}>
                  ORKD
                </p>
                <label htmlFor="Username" className="grey-text">
                  Your Username
                </label>
                <input
                  type="Username"
                  id="defaultFormLoginUsername"
                  className="form-control"
                  onChange={this.handleInputChange}
                  name="userName"
                />
                <br />
                <label
                  htmlFor="defaultFormLoginPasswordEx"
                  className="grey-text"
                >
                  Your password
                </label>
                <input
                  type="password"
                  id="defaultFormLoginPasswordEx"
                  className="form-control"
                  onChange={this.handleInputChange}
                  name="pass"
                />
                <div className="text-center mt-4">
                  <MDBBtn color="indigo" type="submit">
                    Login
                  </MDBBtn>
                </div>
              </form>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}
