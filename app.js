var express = require('express')
var indexRouter = require('./routes/index.js')
var app = express()
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use("/", indexRouter)

var http = require('http');
app.set('port', '3000');
var server = http.createServer(app);
server.listen(3000, () => {
  console.log('app listens at port 3000')
})
const io = require('socket.io')(server)


const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log('roomId', roomId)
    socket.join(roomId)
    // emit join the room event for all clients
    console.log('hoang123 join the room')
    socket.to(roomId).emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

