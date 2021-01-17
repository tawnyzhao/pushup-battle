import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import pushupman from "../assets/images/pushupman.png";
import { api } from "../env/server.config";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      loading: false,
    };
    this.create = this.create.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const id = this.props.match;
    console.log(id);
  }

  async handleSubmit(event) {
    let res = await fetch(api + "/session", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomID: this.state.id }),
    });
    let data = await res.json();
    this.props.updateSession({ ...data, roomID: this.state.id });
  }

  async create() {
    let res = await fetch(api + "/session");
    let data = await res.json();
    this.props.updateSession(data);
  }

  handleKey(event) {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  }

  handleChange(event) {
    this.setState({ id: event.target.value });
  }

  render() {
    const { id } = this.state.id;
    // const { createRoom } = this.props;
    return (
      <div className="container w-1/2 flex flex-col mx-auto my-64 space-y-4 px-4">
        <img
          src={pushupman}
          className="w-20 mx-auto"
          style={{ filter: "drop-shadow(0 0 5px #808080)" }}
        ></img>
        <h1 className="text-5xl pb-2 font-normal">Pushup Battle</h1>
        <p className="text-xl font-light pb-2">
          Challenge your friends in a pushup contest
        </p>
        <div className="container w-1/4 flex flex-col mx-auto">
          <div className="pb-10 pt-4 flex">
            <button
              type="button"
              className="flex-grow py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none"
              onClick={this.create}
            >
              New Room 🥊
            </button>
          </div>
          <div className="pb-2 flex justify-center">
            <input
              onKeyPress={this.handleKey}
              onChange={this.handleChange}
              value={id}
              type="text"
              maxLength="4"
              className="flex-grow py-2 px-4 font-semibold rounded-lg border shadow-sm focus:outline-none bg-gray-100 focus:bg-white text-center"
              placeholder="Enter Room Code"
            />
          </div>
          <button
            onClick={this.handleSubmit}
            className="flex-initial py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 active:bg-green-700 focus:outline-none"
          >
            Join Room ⚔️
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Landing);
