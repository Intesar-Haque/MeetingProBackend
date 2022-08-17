const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }, path: "/socket"
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, connectedUser) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', connectedUser);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', connectedUser.peerId);
        })
        socket.on('chat', (content) => {
            socket.broadcast.to(roomId).emit('new-message', content);
        })
        socket.on('draw', (content) => {
            socket.broadcast.to(roomId).emit('new-draw', content);
        })
        socket.on('white-board', (content) => {
            socket.broadcast.to(roomId).emit('hide-whiteboard', content);
        })
        socket.on('share-screen', (content) => {
            socket.broadcast.to(roomId).emit('on-share-screen', content);
        })
    })

});
const port = 3000;
server.listen(port, () => console.log('listening on port' + port));