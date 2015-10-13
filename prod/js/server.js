var path = require("path");
var express = require("express");
var Bacon = require("baconjs");

var app = express();

app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(8080);
console.log("Server listening on port 8080...");
