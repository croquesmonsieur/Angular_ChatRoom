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

let counter = 0;

let users_chatbox = [];
let connections = [];

server.listen(port, () => {
    console.log("server running on " + port);
});

io.on('connection', (socket) => {
    console.log(counter + ' someone connected');
    counter++;
    connections.push(socket);
    let color = randomColor();
    socket.username = 'Anonymous';
    socket.color = color;

    socket.on('sendToAll', (message) => {
        io.emit("displayMessage", (message));
    });

    socket.on('sendToMe', (message) => {
        socket.emit("displayMessage", (message));
    });

    socket.on('listUsers', (users) => {
        let id = uuid.v4();
        socket.id = id;
        socket.username = users;
        users_chatbox.unshift({id, username: socket.username, color: socket.color});
        socket.emit('announcements', { message: 'A new user has joined!' });
        io.emit('usersInfo', (users_chatbox));
        io.emit('update_user_list', (users_chatbox));
    });

    socket.on('disconnect', () => {
        console.log(socket.username + ' ' + 'disconnected');
        if (!socket.username)
            return;
        let user = undefined;
        for (let i = 0; i < users_chatbox.length; i++) {
            if (users_chatbox[i].id === socket.id) {
                user = users_chatbox[i];
                users_chatbox.splice(i,1);
            }
        }
        connections.splice(connections.indexOf(socket),1);
        io.emit('update_user_list', (users_chatbox));
    });

});


