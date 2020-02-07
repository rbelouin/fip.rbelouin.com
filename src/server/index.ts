import _ from "lodash";
import fs from "fs";
import http from "http";
import https from "https";
import qs from "querystring";
import path from "path";
import express from "express";
import expressWs from "express-ws";
import Bacon from "baconjs";
import * as Sentry from "@sentry/node";

import config from "../../prod/js/config.json";
import { fetchRadios } from "../fip/radio-metadata";
import { spotifyLogin, spotifyCallback } from "../spotify/auth";

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

const app = express();

const apiPrefix = "/api";
const publicFolder = process.env.PUBLIC_FOLDER || "";
const certificateFolder = process.env.CERTIFICATE_FOLDER;
const httpsOnly = process.env.HTTPS_ONLY === "1";
const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  loginPath: "/api/login",
  callbackPath: "/api/callback"
};

app.use(function(req, res, next) {
  const protocol =
    req.headers["x-forwarded-proto"] === "https" ? "https" : req.protocol;

  if (httpsOnly && protocol !== "https") {
    res.redirect("https://" + req.headers["host"] + req.originalUrl);
  } else {
    next();
  }
});

_.each(config.routes, function(route, name) {
  app.get(route, function(req, res) {
    res.sendFile(path.resolve(publicFolder, "index.html"));
  });
});

app.use(spotifyConfig.loginPath, spotifyLogin(spotifyConfig));
app.use(spotifyConfig.callbackPath, spotifyCallback(spotifyConfig));

app.use(express.static(publicFolder));

const httpServer = http.createServer(app);
expressWs(app, httpServer);
httpServer.listen(config.port);
console.log("HTTP server listening on port " + config.port + "…");

if (certificateFolder) {
  const credentials = {
    key: fs.readFileSync(path.resolve(certificateFolder, "key.pem")),
    cert: fs.readFileSync(path.resolve(certificateFolder, "cert.pem"))
  };
  const httpsServer = https.createServer(credentials, app);
  expressWs(app, httpsServer);
  httpsServer.listen(8443);
  console.log("HTTPS server listening on port 8443…");
}

const p_radios = fetchRadios(2000, config.radios);
p_radios.onError(error => Sentry.captureMessage(error as any));

(app as any).ws("/ws", function(ws: any, req: any) {
  const unsubscribe = p_radios.onValue(radios => {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(radios));
    }
  });

  ws.on("close", unsubscribe);
});
