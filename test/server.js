var path = require("path");
var express = require("express");

var app = express();

app.get("/api/songs", function(req, res) {
  if(req.accepts("audio/mpeg")) {
    res.sendFile(path.resolve(__dirname, "./coal-train.mp3"));
  }
  else {
    res.sendStatus(406);
  }
});

app.use(express.static(path.resolve(__dirname)));

app.listen(8080);
console.log("Server listening on port 8080...");
