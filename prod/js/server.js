var _ = require("lodash");
var path = require("path");
var express = require("express");
var Bacon = require("baconjs");

var routes = require("./routes.json");

var app = express();

app.use(function(req, res, next) {
  if(req.path.indexOf("/api") === 0) {
    require("http").get("http://localhost:9000" + req.path, function(res2) {
      for(var name in res2.headers) {
        res.setHeader(name, res2.headers[name]);
      }

      res.status(res2.statusCode);
      res2.pipe(res);
    });
  }
  else {
    next();
  }
});

_.each(routes, function(route, name) {
  app.get(route, function(req, res) {
    res.sendFile(path.resolve(__dirname, "../public/index.html"));
  });
});

app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(8080);
console.log("Server listening on port 8080...");
