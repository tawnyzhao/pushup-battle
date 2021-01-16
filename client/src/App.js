import Cam from './components/Cam';
import { useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
const socket = io('http://localhost:9000');

function App() {
  const [score, updateScore] = useState({});
  
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  socket.on("pull score", updateScore);

  
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Cam></Cam>
    </div>
  );
}

export default App;
