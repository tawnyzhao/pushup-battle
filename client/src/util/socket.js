import { io } from "socket.io-client";
import { api } from "../env/server.config";

const socket = io(api, { autoConnect: false });

/* Get socket id */
function onConnect(callback) {
  socket.on("connect", () => callback(socket.id));
}

function pushScore(score) {
  socket.emit("push score", score);
}

function pullScore(callback) {
  socket.on("pull score", (scores) => callback(scores));
}

function pushName(name) {
  socket.emit("push name", name);
}

function pullName(callback) {
  socket.on("pull name", (names) => callback(names));
}

function pushStart(endTime) {
  socket.emit("push start", endTime);
}

function pullStart(callback) {
  socket.on("pull start", (endTime) => callback(endTime));
}

function pushReady(ready) {
  socket.emit("push ready", ready);
}

function pullReady(callback) {
  socket.on("pull ready", (playersReady) => callback(playersReady));
}

export {
  socket,
  onConnect,
  pushScore,
  pullScore,
  pushName,
  pullName,
  pullStart,
  pushStart,
  pullReady,
  pushReady
};
