var path = require("path");
var express = require("express");
var Bacon = require("baconjs");

var app = express();

var p_song = require("./data.js");

p_song.onValue(function(song) {
  console.log("song: " + song.title);
});

app.get("/api/songs", function(req, res) {
  if(req.accepts("audio/mpeg")) {
    res.sendFile(path.resolve(__dirname, "./coal-train.mp3"));
  }
  else {
    res.sendStatus(406);
  }
});

app.get("/api/songs/current", function(req, res) {
  p_song.take(1).onValue(function(song) {
    res.json(song);
  });
});

app.use(express.static(path.resolve(__dirname)));

app.listen(8080);
console.log("Server listening on port 8080...");
