const express = require('express');
const http = require('http');
const app = express();
let randomColor = require('randomcolor');
const uuid = require('uuid');
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = 6969;
//const ioPr = io.of('/privateRoom');
let room_number = 1;
let user_counter = 0;
let room = "Red Room";

let users_chatbox = [];
let connections = [];

server.listen(port, () => {
    console.log("server running on " + port);
});
/*
ioPr.on('connection', (socket) => {
    console.log('someone new connected');
    ioPr.emit('privateEntry', { message: 'A new user has joined!' });
});
*/
io.on('connection', (socket) => {
    console.log(user_counter + ' someone connected');
    user_counter++;
    connections.push(socket);
    let color = randomColor();
    socket.username = 'Anonymous';
    socket.color = color;

    socket.on('sendToAll', (message) => {
        io.emit("displayMessageAll", ({message: message, color: color}));
    });

    socket.on('sendToMe', (message) => {
        socket.emit("displayMessageMe", ({message: message, color: color}));
    });

    socket.on('listUsers', (users) => {
        let id = uuid.v4();
        socket.id = id;
        socket.username = users;
        users_chatbox.unshift({id, username: socket.username, color: socket.color});
        io.emit('announcements', { message: 'A new user has joined!' });
        io.emit('usersInfo', (users_chatbox));
        io.emit('update_user_list', (users_chatbox));
    });

    socket.on('disconnect', () => {
        console.log(socket.username + ' ' + 'disconnected');
        user_counter--
        if (!socket.username)
            return;
        let user = undefined;
        for (let i = 0; i < users_chatbox.length; i++) {
            if (users_chatbox[i].id === socket.id) {
                user = users_chatbox[i];
                users_chatbox.splice(i,1);
                io.emit('Goodbye', { message: 'A user has left!' + ' ' + 'Bye' + ' ' + user.username});
            }
        }
        connections.splice(connections.indexOf(socket),1);

        io.emit('update_user_list', (users_chatbox));
    });

    socket.on('room', (room) =>{
        socket.leave();
        socket.join(room);
        io.sockets.in(room).emit('connectToRoom', { message: "You are very welcome in room no. "+room});
    });

});


