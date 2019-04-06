import _ from "lodash";
import qs from "querystring";
import path from "path";
import express from "express";
import Bacon from "baconjs";

import config from "../../prod/js/config.json";

const app = express();

const apiPrefix = "/api";
const publicFolder = process.env.PUBLIC_FOLDER || "";
const httpsOnly = process.env.HTTPS_ONLY === "1";

console.log(publicFolder);

app.use(function(req, res, next) {
  const protocol =
    req.headers["x-forwarded-proto"] === "https" ? "https" : "http";

  if (httpsOnly && protocol !== "https") {
    res.redirect("https://" + req.headers["host"] + req.originalUrl);
  } else if (req.path.indexOf(apiPrefix) === 0) {
    res.redirect(
      protocol +
        "://" +
        config.api.http_host +
        req.path.slice(apiPrefix.length) +
        "?" +
        qs.stringify(req.query)
    );
  } else {
    next();
  }
});

_.each(config.routes, function(route, name) {
  app.get(route, function(req, res) {
    res.sendFile(path.resolve(publicFolder, "index.html"));
  });
});

app.use(express.static(publicFolder));

app.listen(config.port);
console.log("Server listening on port " + config.port + "…");
