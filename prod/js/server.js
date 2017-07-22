var _ = require("lodash");
var qs = require("querystring");
var path = require("path");
var express = require("express");
var Bacon = require("baconjs");

var config = require("./config.json");

var app = express();

var apiPrefix = "/api";

app.use(function(req, res, next) {
  var protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";

  if(req.path.indexOf(apiPrefix) === 0) {
    res.redirect(protocol + "://" + config.api.http_host + req.path.slice(apiPrefix.length) + "?" + qs.stringify(req.query));
  }
  else {
    next();
  }
});

_.each(config.routes, function(route, name) {
  app.get(route, function(req, res) {
    res.sendFile(path.resolve(__dirname, "../public/index.html"));
  });
});

app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(config.port);
console.log("Server listening on port " + config.port + "…");
