import { io } from "socket.io-client";

const socket = io("http://localhost:9000", {autoConnect: false});

/* Get socket id */
function onConnect(callback) {
  socket.on('connect', () => callback(socket.id))
}

function pushScore(score) {
  socket.emit('push score', score)
};

function pullScore(callback) {
  socket.on('pull score', scores => callback(scores))
}

export {
  socket,
  onConnect,
  pushScore,
  pullScore
};

