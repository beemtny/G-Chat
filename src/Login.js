import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import "./App.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
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
    console.log(this.state.userID);
    console.log(this.state.pass);
    return this.props.history.push("/chat");
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
                  name="userID"
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
