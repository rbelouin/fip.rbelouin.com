import _ from "lodash";
import Bacon from "baconjs";

export function getState(SongController, favBus, token) {
  const p_print = !token ? Bacon.constant(null) :
                           SongController.getSpotifyPrint(token).toProperty();

  const p_syncs = p_print
    .flatMapLatest(print => SongController.getSyncs(print))
    .toProperty();

  const p_favSongs = p_syncs
    .flatMapLatest(syncs => {
      return SongController.getFavSongsStream(syncs, favBus).toEventStream();
    })
    .toProperty();

  p_syncs.flatMapLatest(syncs => {
    return p_favSongs.flatMapLatest(songs => {
      return SongController.setFavoriteSongs(syncs, songs);
    });
  }).onValue();

  const data = SongController.getFipSongLists();

  const radioSongs = _.mapValues(data, radio => {
    const p_songs = Bacon.combineWith(
      SongController.mergeFavsAndSongs,
      radio,
      p_favSongs
    );

    const p_pastSongs = p_songs.map(_.tail);

    const p_nowPlaying = p_songs
      .map(songs => _.isEmpty(songs) ? {type: "loading"} : _.head(songs))
      .flatMapError(data => Bacon.once(data && data.error && data.error.code === 100 ? {type: "unknown"} : new Bacon.Error(data.error)))
      .toProperty();

    return {
      nowPlaying: p_nowPlaying,
      pastSongs: p_pastSongs
    };
  });

  return Bacon.combineTemplate({
    user: p_print.map(print => print && print.user),
    favSongs: p_favSongs,
    radios: radioSongs
  });
}

export default (SongController) => ({
  getState: _.partial(getState, SongController)
})
