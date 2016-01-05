import _ from "lodash";
import qs from "querystring";
import React from "react";

import Intl from "intl";
import {IntlMixin} from "react-intl";

// Sadly, bacon-routes does mutate the Bacon object
const Bacon = window.Bacon = require("baconjs");
require("bacon-routes");

import getHttp from "./models/http.js";
import getWebSocket from "./models/websocket.js";
import getStorage from "./models/storage.js";
import getSpotify from "./models/spotify.js";
import getFip from "./models/fip.js";
import getTokenController from "./controllers/token.js";
import getSongController from "./controllers/song.js";

// TODO: remove this code after a while (2016)
function _legacyMoveToken() {
  if(localStorage.access_token
  && localStorage.refresh_token
  && localStorage.expires_in
  && localStorage.token_type) {
    localStorage.token = JSON.stringify({
      access_token: localStorage.access_token,
      refresh_token: localStorage.refresh_token,
      expires_in: localStorage.expires_in,
      token_type: localStorage.token_type
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("token_type");
  }
}

export function start(conf) {
  _legacyMoveToken();

  /* Bind the unsafe dependencies to the models */
  const Http = getHttp(fetch);
  const WS = getWebSocket(WebSocket);
  const Storage = getStorage(localStorage);
  const Spotify = getSpotify(Http, location);
  const Fip = getFip(WS);
  const TokenController = getTokenController(Storage, Spotify, location);
  const SongController = getSongController(Storage, Spotify, Fip, conf.api.ws_host);

  const intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  const volBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();
  const favBus = new Bacon.Bus();
  const spotifyBus = new Bacon.Bus();
  const playBus = new Bacon.Bus();

  const p_token = TokenController.getTokenProperty(Bacon.history, syncBus);
  const p_state = p_token.flatMapLatest(token => {
    return SongController.getState(favBus, token);
  }).toProperty();


  const routes = Bacon.fromRoutes({
    routes: conf.routes
  });

  routes.errors.onValue(function() {
    Bacon.history.pushState(null, null, "/");
  });

  const p_route = _.foldl(routes, function(p_route, stream, name) {
    return name === "errors" ? p_route : p_route.merge(stream.map(name));
  }, Bacon.never());

  const App = require("./views/app.jsx");

  window.addEventListener("load", function() {
    const s_click = Bacon.fromEvent(
      document.querySelector(".navbar .navbar-brand a"),
      "click"
    );

    const p_paneIsOpen = s_click.doAction(".preventDefault")
                              .scan(false, function(isOpen) {
                                return !isOpen;
                              });

    const p_playerOnBottom = Bacon
      .fromBinder(sink => {
        const mediaQuery = matchMedia("(max-width: 991px)");

        mediaQuery.addListener(sink);
        sink(mediaQuery);

        return () => mediaQuery.removeListener(sink);
      })
      .map(".matches");

    const p_source = spotifyBus.map("spotify")
      .merge(playBus.filter(isPlaying => isPlaying).map("radio"))
      .toProperty("radio");

    const p_nowPlaying = p_state.map(".nowPlaying");

    const p_spotifySong = spotifyBus.map(songId => ({
      type: "spotify",
      songId: songId
    })).toProperty();

    const p_playerData = Bacon.mergeAll(
      p_spotifySong.toEventStream(),
      p_nowPlaying.toEventStream().filter(p_source.map(s => s === "radio")),
      p_nowPlaying.sampledBy(p_source.filter(s => s === "radio"))
    ).toProperty();

    React.render(
      <App
        url={conf.api.http_host + "/songs"}
        p_route={p_route}
        p_paneIsOpen={p_paneIsOpen}
        p_playerOnBottom={p_playerOnBottom}
        p_pastSongs={p_state.map(".pastSongs")}
        p_nowPlaying={p_nowPlaying}
        p_playerData={p_playerData}
        p_favSongs={p_state.map(".favSongs")}
        p_user={p_state.map(".user")}
        syncBus={syncBus}
        favBus={favBus}
        volBus={volBus}
        spotifyBus={spotifyBus}
        playBus={playBus}
        {...intl}
      />,
      document.querySelector("#app")
    );

    Bacon.history.pushState(null, null, window.location.pathname + window.location.search);
  });
}
