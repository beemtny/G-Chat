import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Chat from "./Chat";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Link to="/">Login</Link>
          <Link to="/chat">Chat</Link>

          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/chat" component={Chat} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
