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
  const eventUrl = conf["stats-api"].http_host + "/events";

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

  /* Bind the models to the controllers */
  const TokenController = getTokenController(Storage, Spotify, location);
  const SongController = getSongController(Storage, Spotify, Fip, conf.api.ws_host, conf.radios.map(r => r.name));
  const PlayController = getPlayController(conf.radios);
  const EventController = getEventController(Storage, Http, uuid, intl, window);
  const RouteController = getRouteController(Bacon, conf.routes);
  const UIController = getUIController(window);

  /* Use all the controllers to build a state we will forward to the App component */
  const StateController = getStateController(
    TokenController,
    SongController,
    RouteController,
    PlayController,
    EventController,
    UIController
  );

  const state = StateController.getState(Bacon.history, eventUrl, favBus, syncBus, playBus);

  const App = require("./views/app.jsx");

  UIController.getLoadEvent().onValue(function() {
    React.render(
      <App
        radios={conf.radios}
        state={state}
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
