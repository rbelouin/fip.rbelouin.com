import _ from "lodash";
import Bacon from "baconjs";

export function fetchFipSongs(connectForever, url) {
  const stream = connectForever(url);

  return stream
    .map(data => data.song)
    .skipDuplicates((s1, s2) => s1.startTime >= s2.startTime)
    .toProperty();
}

export function fetchFipRadios(connectForever, url, radios) {
  const stream = connectForever(url);

  return _.foldl(radios, (data, radio) => {
    data[radio] = stream
      .flatMapLatest(data => Bacon.once(data[radio] || new Bacon.Error()))
      .endOnError()
      .skipDuplicates((s1, s2) => {
        return s1.type === "song"
            && s2.type === "song"
            && s1.song.startTime >= s2.song.startTime;
      });

    return data;
  }, {});
}

export default (WebSocket) => ({
  fetchFipSongs: _.partial(fetchFipSongs, WebSocket.connectForever),
  fetchFipRadios: _.partial(fetchFipRadios, WebSocket.connectForever)
});
