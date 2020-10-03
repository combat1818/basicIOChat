var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', function (socket) {
    socket.on('new-user', name => {
        console.log(name)
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    });

    socket.on('send-chat-message', message => {
 //       console.log(message)
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
});