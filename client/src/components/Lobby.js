import { INITIAL_COUNTER, step } from "../util/fsm";
import Cam from "./Cam";
import React, { Component } from "react";
import socket from "../util/socket";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: INITIAL_COUNTER,
      scores: {},
      names: {},
      id: socket.id,
    };

    socket.on("pull score", (scores) => {
      this.setState({ scores });
    });

    this.update = this.update.bind(this);
  }

  update(nextState) {
    const nextCounter = step(this.state.counter, nextState);
    if (nextCounter.count != this.state.counter.count) {
      socket.emit("push state", nextCounter.count);
    }
    this.setState({ counter: nextCounter });
  }

  render() {
    return (
      <div className="mx-96">
        <h1 className="text-3xl">Score: {this.state.counter.count} </h1>
        <Cam onResult={this.update} text="hello"></Cam>
      </div>
    );
  }
}

export default Lobby;
