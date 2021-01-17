import React, { Component } from "react";
import pushupman from "../assets/images/pushupman.png";

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

  async handleSubmit(event) {
    let res = await fetch("http://localhost:9000/session", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      body: JSON.stringify({ roomID: this.state.id }), // body data type must match "Content-Type" header
    });
    let data = await res.json();
    this.props.updateSession({ ...data, id: this.state.id });
  }

  async create() {
    let res = await fetch("http://localhost:9000/session");
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
    const { id } = this.state;
    const { createRoom } = this.props;
    return (
      <div className="container w-1/2 flex flex-col mx-auto my-64 space-y-4 px-4">
        <img src={pushupman} className="w-20 mx-auto"></img>
        <h1 className="text-5xl pb-2 font-normal">Pushup Battle</h1>
        <p className="text-xl font-light pb-2">
          Challenge your friends in a pushup contest
        </p>
        <div className="container w-1/4 flex flex-col mx-auto">
          <div className="space-y-4 flex-grow space-y-4 pb-10 pt-4">
            <button
              type="button"
              className="flex-initial py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md active:bg-blue-700 focus:outline-none"
              onClick={this.create}
            >
              New Room
            </button>
          </div>
          <input
            onKeyPress={this.handleKey}
            onChange={this.handleChange}
            value={id}
            type="text"
            className="flex-initial py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none"
            placeholder="Enter Room Code"
          />
          <button
            onClick={this.handleSubmit}
            className="flex-initial py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md active:bg-green-700 focus:outline-none"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }
}

export default Landing;
