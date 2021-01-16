import Cam from "./components/Cam";
import { useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import Lobby from "./components/Lobby";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Lobby></Lobby>
    </div>
  );
}

export default App;
