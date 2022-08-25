const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const port = 3000;
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "192.168.1.252",
    port:"3306",
    user: "sohel",
    password: "Remi@123",
    database:"trainingPro"
  });
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);
router.get('/',(req, res) => {
    res.end('SERVER IS WORKING');
});
router.post('/login',(req, res) => {
    var user_name = req.body.user;
    var password = req.body.password;
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(`SELECT COUNT(id) FROM user WHERE login_id='${user_name}' AND password='${password}';`, function (err, result) {
          if (err) throw err;
          console.log(JSON.parse(result));
        });
      });
    res.end(user_name+' -- '+password);
});;

server.listen(port, () => console.log('listening on port' + port));