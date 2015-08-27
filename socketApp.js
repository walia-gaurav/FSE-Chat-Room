var http = require('http');
var express = require('express');

var app = express();
app.set('port', 3000);

var appServer = http.createServer(app);
var io = require('socket.io')(appServer);

app.use(express.static('public'));

/* Code to show nodeJs image as a ping response */
app.get('/ping', function(req, res) {
    res.sendFile(__dirname + '/ping.html');
});

/* Actual get URL to fetch CHAT window. */
app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// accept POST request on the homepage
//app.post('/', function(req, res) {
//    res.send('Hey, I just received a POST request');
//});


//io.on('connection', function(socket) {
  //  var address = socket.handshake.address;
 //   console.log("New connection from " + address);
//});

appServer.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function (socket) {
  console.log(socket.handshake.address + ' ' + socket.id + ' connected');
  socket.on('disconnect', function () {
    console.log(socket.handshake.address + ' ' + socket.id + ' disconnected');
  });
});


io.on('connection', function(socket) {
  socket.on('inputMessage', function(msg){
    console.log('Received input: ' + msg + ' from ' + socket.id);
    io.sockets.emit('inputMessage', msg);
  });
});

