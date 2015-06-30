var http = require('http');
var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function() {

    console.log('Express server listening on port ' + app.get('port'));

    app.use(express.static('public'));
    app.get('/', function(req, res) {
        res.send('Hello World!');
    });

    app.get('/gaurav', function(req, res) {
        res.send('Hello Gaurav!');
    });

    // accept POST request on the homepage
    app.post('/', function(req, res) {
        res.send('FSE Chat Room just received a POST request');
    });
});