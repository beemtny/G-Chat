import React, { Component } from "react";

export default class GrChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoin: false
    };
  }
  render() {
    return (
      <div className="grChar">
        gr1
        {this.state.isJoin ? (
          <button
            type="button"
            class="btn btn-outline-success float-right ml-auto "
          >
            Join
          </button>
        ) : (
<button
            type="button"
            class="btn btn-outline-success float-right ml-auto "
          >
            Chat
          </button>
        )}
      </div>
    );
  }
}
