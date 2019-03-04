import _ from "lodash";
import Bacon from "baconjs";

export function connect(WS, location, url) {
  return Bacon.fromBinder(function(sink) {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WS(protocol + "//" + url);

    socket.onmessage = function(message) {
      try {
        const data = JSON.parse(message.data);
        sink(data.type === "error" ? new Bacon.Error(data) : data);
      } catch (e) {
        sink(new Bacon.Error(e));
      }
    };

    socket.onerror = function() {
      sink(new Bacon.End());
      socket.close();
    };

    socket.onclose = function() {
      sink(new Bacon.End());
    };

    return function() {
      setTimeout(() => socket.close(), 2000);
    };
  });
}

export function connectForever(WS, location, url) {
  const s_connect = connect(
    WS,
    location,
    url
  );
  const s_end = s_connect
    .errors()
    .skipErrors()
    .mapEnd();

  return s_connect.merge(
    s_end.flatMapLatest(function() {
      return connectForever(WS, location, url);
    })
  );
}

export default (WebSocket, location) => ({
  connect: _.partial(connect, WebSocket, location),
  connectForever: _.partial(connectForever, WebSocket, location)
});
