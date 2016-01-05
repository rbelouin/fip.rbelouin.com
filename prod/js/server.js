var _ = require("lodash");
var path = require("path");
var express = require("express");
var Bacon = require("baconjs");

var config = require("./config.json");

var app = express();

_.each(config.routes, function(route, name) {
  app.get(route, function(req, res) {
    res.sendFile(path.resolve(__dirname, "../public/index.html"));
  });
});

app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(config.port);
console.log("Server listening on port " + config.port + "…");
