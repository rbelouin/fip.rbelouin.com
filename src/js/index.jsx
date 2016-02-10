import _ from "lodash";
import qs from "querystring";
import uuid from "uuid";
import React from "react";

import Intl from "intl";
import {IntlMixin} from "react-intl";

import Promise from "promise";
window.Promise = Promise;

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
import getEventController from "./controllers/event.js";
import getRouteController from "./controllers/route.js";
import getUIController from "./controllers/ui.js";
import getStateController from "./controllers/state.js";

export function start(conf) {
  const volBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();
  const favBus = new Bacon.Bus();
  const playBus = new Bacon.Bus();

  const intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  /* Bind the unsafe dependencies to the models */
  const Http = getHttp(fetch);
  const WS = getWebSocket(WebSocket);
  const Storage = getStorage(localStorage);
  const Spotify = getSpotify(Http, location);
  const Fip = getFip(WS);
  const TokenController = getTokenController(Storage, Spotify, location);
  const SongController = getSongController(Storage, Spotify, Fip, conf.api.ws_host, conf.radios.map(r => r.name));
  const PlayController = getPlayController(conf.radios);
  const EventController = getEventController(Storage, Http, uuid, intl, window);
  const RouteController = getRouteController(Bacon, conf.routes);
  const UIController = getUIController(window);

  const StateController = getStateController(
    TokenController,
    SongController,
    RouteController,
    UIController
  );

  const state = StateController.getState(Bacon.history, favBus, syncBus);
  const p_route = state.route;

  const p_radio = PlayController.getCurrentRadio(state.routes.radio);

  const p_radios = state.radios;

  // Song being broadcasted by the radio having the focus
  const p_bsong = PlayController.getBroadcastedSong(state.routes.radio, p_radios);

  // Song history of the radio having the focus
  const p_history = PlayController.getSongHistory(state.routes.radio, p_radios);

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

  EventController.watchBrowseEvents(p_route).onValue(ev => {
    const url = conf["stats-api"].http_host + "/events";
    EventController.sendEvent(url, ev);
  });

  const App = require("./views/app.jsx");

  UIController.getLoadEvent().onValue(function() {
    React.render(
      <App
        radios={conf.radios}
        url={conf.api.http_host + "/songs"}
        p_route={p_route}
        p_paneIsOpen={state.paneIsOpen}
        p_playerOnBottom={state.playerOnBottom}
        p_pastSongs={p_history}
        p_nowPlaying={p_bsong}
        p_playerData={p_psong}
        p_src={p_src}
        p_favSongs={state.favSongs}
        p_user={state.user}
        p_radio={p_radio}
        syncBus={syncBus}
        favBus={favBus}
        volBus={volBus}
        playBus={playBus}
        {...intl}
      />,
      document.querySelector("#app")
    );

    RouteController.browseTo(window.location.pathname + window.location.search);
  });
}
