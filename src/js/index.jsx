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
import getPlayController from "./controllers/play.js";

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

  const routes = Bacon.fromRoutes({
    routes: conf.routes
  });

  routes.home.onValue(function() {
    Bacon.history.pushState(null, null, "/radios/fip-radio");
  });

  routes.errors.onValue(function() {
    Bacon.history.pushState(null, null, "/");
  });

  /* Bind the unsafe dependencies to the models */
  const Http = getHttp(fetch);
  const WS = getWebSocket(WebSocket);
  const Storage = getStorage(localStorage);
  const Spotify = getSpotify(Http, location);
  const Fip = getFip(WS);
  const TokenController = getTokenController(Storage, Spotify, location);
  const SongController = getSongController(Storage, Spotify, Fip, conf.api.ws_host, conf.radios.map(r => r.name));
  const PlayController = getPlayController(conf.radios, routes.radio.toProperty({
    params: {
      radio: conf.radios[0].name
    }
  }));

  const intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  const volBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();
  const favBus = new Bacon.Bus();
  const playBus = new Bacon.Bus();

  const p_token = TokenController.getTokenProperty(Bacon.history, syncBus);
  const p_state = p_token.flatMapLatest(token => {
    return SongController.getState(favBus, token);
  }).toProperty();

  const p_radio = PlayController.getCurrentRadio();
  const p_radios = p_state.map(state => state.radios);

  // Song being broadcasted by the radio having the focus
  const p_bsong = PlayController.getBroadcastedSong(p_radios);

  // Song history of the radio having the focus
  const p_history = PlayController.getSongHistory(p_radios);

  const p_cmds = p_radio
    .toEventStream()
    .first()
    .map(radio => ({type: "radio", radio: radio}))
    .merge(playBus)
    .toProperty();

  // Song being played
  const p_psong = PlayController.getSongBeingPlayed(p_radios, p_cmds);

  // Is the player playing a song?
  const p_src = PlayController.getCurrentSource(playBus);

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

    React.render(
      <App
        radios={conf.radios}
        url={conf.api.http_host + "/songs"}
        p_route={p_route}
        p_paneIsOpen={p_paneIsOpen}
        p_playerOnBottom={p_playerOnBottom}
        p_pastSongs={p_history}
        p_nowPlaying={p_bsong}
        p_playerData={p_psong}
        p_src={p_src}
        p_favSongs={p_state.map(".favSongs")}
        p_user={p_state.map(".user")}
        p_radio={p_radio}
        syncBus={syncBus}
        favBus={favBus}
        volBus={volBus}
        playBus={playBus}
        {...intl}
      />,
      document.querySelector("#app")
    );

    Bacon.history.pushState(null, null, window.location.pathname + window.location.search);
  });
}
