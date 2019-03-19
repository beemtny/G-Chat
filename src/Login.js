import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import "./App.css";

const FormPage = () => {
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol className="mt-4">
          <form className="login">
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
            />
            <br />
            <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
              Your password
            </label>
            <input
              type="password"
              id="defaultFormLoginPasswordEx"
              className="form-control"
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
  );
};

export default FormPage;
