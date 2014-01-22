// var app = require('express')()
//   , server = require('http').createServer(app)
//   , io = require('socket.io').listen(server);

var express = require('express')
  , app = express()
  , http = require('http')
  , io = require('socket.io')
  , _ = require('lodash')
  , PORT_NUMBER = 8000;

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/js'));
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var server = http.createServer(app);
server.listen(PORT_NUMBER);
console.log('Listening on port: ' + PORT_NUMBER);

var fakeDB = [
  {word: "Hello", count: 3},
  {word: "Hi", count: 13},
  {word: "Kowabunga", count: 12}
];

var sock = io.listen(server);
sock.sockets.on('connection', function (socket) {
  console.log('connected to ' + socket.id);
  socket.emit('haveSomeWords', fakeDB);
  socket.on('userUpdatedWord', function (newWord) {
    var updated = false;
    _.forEach(fakeDB, function(currentWord, index) {
      if (currentWord.word == newWord.word) {
        fakeDB[index] = newWord;
        var updated = true;
        return false; // to break out of the for loop early
      }
    }, this);

    if (!updated) { fakeDB.push(newWord); }

    socket.broadcast.emit("haveSomeWords", [newWord]);
  });
});
