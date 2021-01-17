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

let gameLength = 10000;
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
      countingDown: false,
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

  // handles setting gameEnded, gameStarted, and countingDown states based on current time
  componentDidUpdate() {
    if (this.state.gameStarted === true) {
      if (this.state.gameTimeEnd - Date.now() < 0) {
        this.setState({ gameEnded: true, gameStarted: false });
      } else if (
        this.state.gameTimeEnd - Date.now() >= gameLength &&
        this.state.countingDown === false
      ) {
        this.setState({ countingDown: true });
      } else if (
        this.state.gameTimeEnd - Date.now() <= gameLength &&
        this.state.countingDown === true
      ) {
        this.setState({ countingDown: false });
      }
    }
  }

  // runs when onResult is called in the Camera object
  update(nextState) {
    if (this.state.gameStarted && this.state.countingDown === false) {
      const nextCounter = step(this.state.counter, nextState);
      if (nextCounter.count != this.state.counter.count) {
        pushScore(nextCounter.count);
      }
      this.setState({ counter: nextCounter });
    } else {
      this.setState({});
    }
  }

  //sends ping to start game to server
  startGame() {
    let endDate = Date.now() + gameLength + 5000;
    pushStart(endDate);
  }

  render() {
    let leaderboard = <div></div>;
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

        {/* game timer */}
        <div>
          {this.state.gameTimeEnd - Date.now() > 0 &&
          this.state.gameTimeEnd - Date.now() < gameLength ? (
            <h1 className="text-xl">
              Timer: {(this.state.gameTimeEnd - Date.now()) / 1000}
            </h1>
          ) : null}
        </div>

        {/* counting down */}
        <h1 className="text-8xl">
          {this.state.gameTimeEnd - Date.now() > gameLength &&
          Math.ceil((this.state.gameTimeEnd - Date.now()) / 1000) <=
            gameLength / 1000 + 5
            ? Math.ceil((this.state.gameTimeEnd - Date.now()) / 1000) -
              gameLength / 1000
            : null}
        </h1>

        {/* displaying users and their scores */}
        {Object.entries(this.state.scores).map(([id, score]) => (
          <p>{`${this.state.names[id] || ""}: ${score}`}</p>
        ))}
        <Cam onResult={this.update}></Cam>
      </div>
    );
  }
}

export default Lobby;
