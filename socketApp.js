var http = require('http');
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3000);

var appServer = http.createServer(app);
var io = require('socket.io')(appServer);

app.use(express.static('public'));

app.get('/ping', function(req, res) {
    res.sendFile(__dirname + '/ping.html');
});

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// accept POST request on the homepage
app.post('/', function(req, res) {
    res.send('Hey, I just received a POST request');
});


//io.on('connection', function(socket) {
  //  var address = socket.handshake.address;
 //   console.log("New connection from " + address);
//});

io.on('connection', function (socket) {
        console.log(socket.handshake.address + ' connected');
    socket.on('disconnect', function () {
        console.log(socket.handshake.address + ' disconnected');
    });
});


io.on('connection', function(socket) {
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

appServer.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});