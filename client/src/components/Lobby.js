import { INITIAL_COUNTER, step } from "../util/fsm";
import Cam from "./Cam";
import React, { Component } from "react";
import man from "../assets/images/pushupman.png";
import {
  socket,
  pullScore,
  pushScore,
  pullName,
  pushName,
  pullStart,
  onConnect,
  pushStart,
} from "../util/socket";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: INITIAL_COUNTER,
      scores: {},
      names: {},
      id: "",
      name: "",
      gameStarted: false,
      gameEnded: false,
      gameTimeEnd: -1,
    };
    this.update = this.update.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    onConnect((id) => this.setState({ id }));
    socket.open();

    this.setState({ id: socket.id });
    pullScore((scores) => this.setState({ scores }));
    pullName((names) => this.setState({ names }));
    pullStart((endTime) =>
      this.setState({
        gameTimeEnd: endTime,
        gameStarted: true,
        gameEnded: false,
      })
    );
  }

  componentDidUpdate() {}

  update(nextState) {
    const nextCounter = step(this.state.counter, nextState);
    if (nextCounter.count != this.state.counter.count) {
      pushScore(nextCounter.count);
    }
    this.setState({ counter: nextCounter });
  }

  startGame() {
    let endDate = Date.now() + 35000;
    pushStart(endDate);
  }

  render() {
    return (
      <div className="mx-96">
        <div>
          <img src={man} className="w-20 mx-auto my-5"></img>
        </div>
        <h1 className="text-3xl">Score: {this.state.counter.count} </h1>
        <input
          placeholder="Your Name"
          type="text"
          value={this.state.name}
          onChange={(event) => {
            const name = event.target.value;
            pushName(name);
            this.setState({ name });
          }}
        />
        <button onClick={this.startGame}>START</button>
        <div>
          {this.state.gameTimeEnd - Date.now() > 0 &&
          this.state.gameTimeEnd - Date.now() < 30000 ? (
            <h1 className="text-xl">
              Timer: {(this.state.gameTimeEnd - Date.now()) / 1000}
            </h1>
          ) : null}
        </div>
        <h1 className="text-8xl">
          {this.state.gameTimeEnd - Date.now() > 30000 &&
          Math.ceil((this.state.gameTimeEnd - Date.now()) / 1000) <= 35
            ? Math.ceil((this.state.gameTimeEnd - Date.now()) / 1000) - 30
            : null}
        </h1>
        {Object.entries(this.state.scores).map(([id, score]) => (
          <p>{`${this.state.names[id] || ""}: ${score}`}</p>
        ))}
        <Cam onResult={this.update}></Cam>
      </div>
    );
  }
}

export default Lobby;
