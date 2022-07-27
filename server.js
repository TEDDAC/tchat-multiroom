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
    io.to(Array.from(socket.rooms)).emit('user deconnected', users.get(socket).nickname);
    socket.leave(Array.from(socket.rooms));
    console.log(users.get(socket).nickname + ' s\'est déconnecté');
    users.delete(socket);
  });

  socket.on('chat message', (msg) => {
    let pseudo = users.get(socket).nickname;

    console.log(Array.from(socket.rooms)[1] + '> ' + pseudo + ': ' + msg);
    io.to(Array.from(socket.rooms)).emit('chat message', pseudo + ': ' + msg);
  });
  
  socket.on('createConnection', function(pseudo, roomId){
    socket.join(roomId);

    let roomUsers = [];
    users.forEach((value, key, set) => {
      if(value.room == roomId)
        roomUsers.push(value.nickname);
    })
    //console.log(roomUsers);

    socket.emit('me connected'
      , pseudo
      , roomUsers);
      
    users.set(socket, {nickname: pseudo, room: roomId});

    io.to(Array.from(socket.rooms)).emit('user connected'
      , pseudo);
    console.log(users.get(socket).nickname + ' vient de se connecter à la salle ' + roomId);
  })
});

server.listen(3000, () => {
  console.log('listening on 3000');
});