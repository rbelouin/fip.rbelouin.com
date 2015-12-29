import _ from "lodash";
import Bacon from "baconjs";

export function connect(WS, url) {
  return Bacon.fromBinder(function(sink) {
    const socket = new WS(url);

    socket.onmessage = function(message) {
      try {
        const data = JSON.parse(message.data);
        sink(data.type === "error" ? new Bacon.Error(data) : data);
      }
      catch(e) {
        sink(new Bacon.Error(e));
      }
    };

    socket.onerror = function(error) {
      sink(new Bacon.Error(error));
    };

    socket.onclose = function() {
      sink(new Bacon.End())
    };

    return function() {
      socket.close();
    };
  });
}

export function connectForever(WS, url) {
  const s_connect = connect(WS, url);
  const s_end = s_connect.errors().skipErrors().mapEnd();

  return s_connect.merge(s_end.flatMapLatest(function() {
    return connectForever(WS, url);
  }));
}

export default (WebSocket) => ({
  connect: _.partial(connect, WebSocket),
  connectForever: _.partial(connectForever, WebSocket)
})
