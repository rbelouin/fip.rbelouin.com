import React from "react";
import {render} from "react-dom";
import {IntlProvider} from "react-intl";

import Promise from "promise";
window.Promise = Promise;

import Bacon from "baconjs";

// Sadly, bacon-routes does mutate the Bacon object
window.Bacon = Bacon;
require("bacon-routes"); // eslint-disable-line no-undef

import Intl from "./models/intl.js";

import getHttp from "./models/http.js";
import getWebSocket from "./models/websocket.js";
import getStorage from "./models/storage.js";
import getSpotify from "./models/spotify.js";
import getFip from "./models/fip.js";
import getTokenController from "./controllers/token.js";
import getSongController from "./controllers/song.js";
import getPlayController from "./controllers/play.js";
import getRouteController from "./controllers/route.js";
import getUIController from "./controllers/ui.js";
import getAutoplayController from "./controllers/autoplay.js";
import getStateController from "./controllers/state.js";

import App from "./views/app.jsx";

export function start(conf) {
  const volBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();
  const favBus = new Bacon.Bus();
  const playBus = new Bacon.Bus();
  const autoplayBus = new Bacon.Bus();

  const intl = Intl.getIntlData(conf.DefaultLanguage);

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
  const RouteController = getRouteController(Bacon, conf.routes);
  const UIController = getUIController(window);
  const AutoplayController = getAutoplayController(Storage);

  /* Use all the controllers to build a state we will forward to the App component */
  const StateController = getStateController(
    TokenController,
    SongController,
    RouteController,
    PlayController,
    UIController,
    AutoplayController
  );

  const state = StateController.getState(Bacon.history, favBus, syncBus, playBus, autoplayBus);

  state.route.onValue(function() {
    ga("set", "page", window.location.pathname);
    ga("send", "pageview");
  });

  render(
    <IntlProvider locale={intl.locales} messages={intl.messages}>
      <App
        radios={conf.radios}
        state={state}
        syncBus={syncBus}
        favBus={favBus}
        volBus={volBus}
        playBus={playBus}
        autoplayBus={autoplayBus}
      />
    </IntlProvider>,
    document.querySelector("#app")
  );

  RouteController.browseTo(window.location.pathname + window.location.search);
}
