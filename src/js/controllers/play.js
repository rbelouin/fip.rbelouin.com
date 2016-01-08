import _ from "lodash";
import Bacon from "baconjs";

export function getCurrentRadio(p_route) {
  return p_route.map(".params.radio").skipDuplicates();
}

export function getBroadcastedSong(p_route, p_radios) {
  const p_radio = getCurrentRadio(p_route);

  const p_song = Bacon.combineWith(p_radio, p_radios, (radio, radios) => {
    return radios[radio].nowPlaying;
  });

  return p_song.skipDuplicates((s1, s2) => {
    return s1.type === "song"
        && s2.type === "song"
        && s1.song.id === s2.song.id;
  }).toProperty();
}

export default (p_route) => ({
  getCurrentRadio: _.partial(getCurrentRadio, p_route),
  getBroadcastedSong: _.partial(getBroadcastedSong, p_route)
})
