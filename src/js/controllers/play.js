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

export function getSongHistory(p_route, p_radios) {
  const p_radio = getCurrentRadio(p_route);

  const p_history = Bacon.combineWith(p_radio, p_radios, (radio, radios) => {
    return radios[radio].pastSongs.map(item => item.song);
  });

  return p_history.skipDuplicates(_.isEqual);
}

export function getSongBeingPlayed(p_radios, p_playBus) {
  const p_cmds = p_playBus.filter(cmd => cmd.type != "stop");

  const p_song = Bacon.combineWith(p_radios, p_cmds, function(radios, cmd) {
    switch (cmd.type) {
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

export function getCurrentSource(radios, s_playBus, autoplayRadio) {
  const defaultRadio = autoplayRadio
    ? _.find(radios, r => r.name === autoplayRadio)
    : null;
  const defaultSource = defaultRadio && defaultRadio.src;

  return s_playBus
    .map(
      cmd =>
        cmd.type === "radio" &&
        _.find(radios, r => {
          return r.name === cmd.radio;
        })
    )
    .map(radio => (radio ? radio.src : null))
    .toProperty(defaultSource);
}

export default radios => ({
  getCurrentRadio: getCurrentRadio,
  getBroadcastedSong: getBroadcastedSong,
  getSongHistory: getSongHistory,
  getSongBeingPlayed: getSongBeingPlayed,
  getCurrentSource: _.partial(getCurrentSource, radios)
});
