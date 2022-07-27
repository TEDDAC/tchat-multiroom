const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const url = require('url');

const users = new Map();

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.leave(Array.from(socket.rooms));
    users.delete(socket);
  });

  socket.on('chat message', (msg) => {
    let pseudo = users.get(socket);

    console.log(Array.from(socket.rooms)[1] + '> ' + pseudo + ': ' + msg);
    io.to(Array.from(socket.rooms)).emit('chat message', pseudo + ': ' + msg);
  });
  
  socket.on('createConnection', function(pseudo, roomId){
    users.set(socket, pseudo);
    socket.join(roomId);
    io.to(Array.from(socket.rooms)).emit('createConnection', pseudo + ' vient d\'arrivé dans la salle ' + roomId);
    console.log(users.get(socket) + ' vient de se connecter à la salle ' + roomId);
  })
});

server.listen(3000, () => {
  console.log('listening on 3000');
});