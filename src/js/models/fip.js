import _ from "lodash";
import Bacon from "baconjs";

import WebSocket from "./websocket.js";

export function fetchFipSongs(connectForever, url) {
  const stream = connectForever(url);

  return stream
    .map(data => data.song)
    .skipDuplicates((s1, s2) => s1.startTime >= s2.startTime)
    .toProperty();
}

export default {
  fetchFipSongs: _.partial(fetchFipSongs, WebSocket.connectForever)
}
