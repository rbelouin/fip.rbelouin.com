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

  return p_song.skipDuplicates(_.isEqual);
}

export function getSongBeingPlayed(p_radios, p_playBus) {
  const p_song = Bacon.combineWith(p_radios, p_playBus, function(radios, cmd) {
    switch(cmd.type) {
      case "loading":
      case "spotify":
        return cmd;
      case "radio":
        return radios[cmd.radio].nowPlaying;
      default:
        return new Bacon.Error();
    }
  });

  return p_song.skipDuplicates(_.isEqual);
}

export default (p_route) => ({
  getCurrentRadio: _.partial(getCurrentRadio, p_route),
  getBroadcastedSong: _.partial(getBroadcastedSong, p_route),
  getSongBeingPlayed: getSongBeingPlayed
})
