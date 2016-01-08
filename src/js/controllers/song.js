import _ from "lodash";
import Bacon from "baconjs";

export function searchOnSpotify(Spotify, song) {
  return Spotify.search(song).map(result => _.extend({}, song, {
    spotify: result ? result.href : null,
    spotifyId: result ? result.id : null
  }));
}

export function getFipSongLists(Fip, Spotify, wsHost, radios) {
  const data = Fip.fetchFipRadios(wsHost, radios);
  const search = _.partial(searchOnSpotify, Spotify);

  return _.mapValues(data, radio => {
    return radio
      .flatMapLatest(item => {
        return item.type === "song" ?
          search(item.song).map(song => _.extend({}, item, {song})) :
          Bacon.constant(item);
      })
      .scan([], (items, item) => [item].concat(items));
  });
}

export function getSpotifyPrint(Spotify, token) {
  const p_user = Spotify.getUser(token).toProperty();

  p_user.onError(res => {
    if(res.status === 401) {
      Spotify.refreshToken(token);
    }
  });

  const p_playlist = p_user
    .flatMapLatest(user => Spotify.getOrCreatePlaylist(token, user.id, "fipradio"))
    .toProperty();

  return Bacon.combineTemplate({
    user: p_user,
    playlist: p_playlist,
    token: token
  });
}

export function getSyncs(Storage, Spotify, print) {
  const storageSync = Storage.sync("favorites");
  const spotifySync = !print ? null : Spotify.sync(
    print.token,
    print.user.id,
    print.playlist.id
  );

  return _.compact([
    storageSync,
    spotifySync
  ]);
}

export function getFavoriteSongs(syncs) {
  const p_songLists = Bacon
    .zipAsArray(_.map(syncs, sync => sync.get()))
    .toProperty();

  return p_songLists.map(function(songLists) {
    const songs = _.flatten(songLists);
    return _.uniq(songs, "spotifyId");
  }).toProperty();
}

export function setFavoriteSongs(syncs, songs) {
  return Bacon.zipAsArray(_.map(syncs, sync => sync.set(songs)));
}

export function updateFavSongs(songs, ev) {
  switch(ev.type) {
    case "add":
      const song = _.extend({}, ev.song, {favorite: true});
      const exists = _.any(songs, s => s.id === song.id);

      return songs.concat(exists ? [] : [song]);
    case "remove":
      return _.reject(songs, song => song.id === ev.song.id);
    default:
      console.error("Unknown type: " + ev.type);
      return songs;
  }
}

export function getFavSongsStream(syncs, favBus) {
  const p_songs = getFavoriteSongs(syncs);

  return p_songs.flatMapLatest(songs => {
    return favBus.scan(songs, updateFavSongs);
  });
}

export function mergeFavsAndSongs(items, favSongs) {
  const favSongsById = _.indexBy(favSongs, "id");

  return _.map(items, item => item.type != "song" ? item : _.extend({}, item, {
    song: _.extend({}, item.song, {
      favorite: _.has(favSongsById, item.song.id) || _.has(favSongsById, item.song.spotifyId)
    })
  }));
}

export function getState(Storage, Spotify, Fip, wsHost, radios, favBus, token) {
  const p_print = !token ? Bacon.constant(null) :
                           getSpotifyPrint(Spotify, token).toProperty();

  const p_syncs = p_print
    .flatMapLatest(print => getSyncs(Storage, Spotify, print))
    .toProperty();

  const p_favSongs = p_syncs
    .flatMapLatest(syncs => {
      return getFavSongsStream(syncs, favBus).toEventStream();
    })
    .toProperty();

  p_syncs.flatMapLatest(syncs => {
    return p_favSongs.flatMapLatest(songs => {
      return setFavoriteSongs(syncs, songs);
    });
  }).onValue();

  const data = getFipSongLists(Fip, Spotify, wsHost, radios);

  const radioSongs = _.mapValues(data, radio => {
    const p_songs = Bacon.combineWith(
      mergeFavsAndSongs,
      radio,
      p_favSongs
    );

    const p_pastSongs = p_songs.map(_.tail);

    const p_nowPlaying = p_songs
      .map(songs => _.isEmpty(songs) ? {type: "loading"} : _.head(songs))
      .flatMapError(data => Bacon.once(data && data.error && data.error.code === 100 ? {type: "unknown"} : new Bacon.Error(error)))
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

export default (Storage, Spotify, Fip, wsHost, radios) => ({
  searchOnSpotify: _.partial(searchOnSpotify, Spotify),
  getFipSongLists: _.partial(getFipSongLists, Fip, Spotify, wsHost),
  getSpotifyPrint: _.partial(getSpotifyPrint, Spotify),
  getSyncs: _.partial(getSyncs, Storage, Spotify),
  getFavoriteSongs,
  setFavoriteSongs,
  updateFavSongs,
  getFavSongsStream,
  mergeFavsAndSongs,
  getState: _.partial(getState, Storage, Spotify, Fip, wsHost, radios)
})
