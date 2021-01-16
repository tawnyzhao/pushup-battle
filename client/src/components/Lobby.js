import { INITIAL_COUNTER, step } from "../util/fsm";
import Cam from "./Cam";
import React, { Component } from "react";
import { socket, pullScore, pushScore, onConnect } from '../util/socket';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: INITIAL_COUNTER,
      scores: {},
      names: {},
      id: ""
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    onConnect((id) => this.setState({ id }))
    socket.open()

    this.setState({id: socket.id})
    pullScore((scores) => this.setState({ scores }))
  }

  update(nextState) {
    const nextCounter = step(this.state.counter, nextState);
    if (nextCounter.count != this.state.counter.count) {
      pushScore(nextCounter.count);
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
