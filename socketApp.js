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

    /* That's how I rock jade, man! */
    //res.render(__dirname + '/index.jade');
});

//Database declaration shit starts
var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
//Database declaration shit ends.

appServer.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket) {
    console.log(socket.handshake.address + ' ' + socket.id + ' connected');

    db.serialize(function() {
        db.each("SELECT rowid AS id, thing FROM ChatHistory", function(err, row) {
            socket.emit('inputMessage', row.thing);
        });
    });

    socket.on('disconnect', function() {
        console.log(socket.handshake.address + ' ' + socket.id + ' disconnected');
    });
});

io.on('connection', function(socket) {

    socket.on('inputMessage', function(msg) {

        console.log('Received input: ' + msg + ' from ' + socket.id);
        //socket.broadcast.emit('inputMessage', msg); 
        io.emit('inputMessage', msg);

        db.serialize(function() {

            if (!exists) {
                db.run("CREATE TABLE ChatHistory (thing TEXT)");
            }

            var stmt = db.prepare("INSERT INTO ChatHistory VALUES (?)");
            stmt.run(msg);
            stmt.finalize();

        });
    });
});