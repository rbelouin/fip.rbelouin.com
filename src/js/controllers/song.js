import _ from "lodash";
import Bacon from "baconjs";

export function searchOnSpotify(Spotify, song, token) {
  const p_result = token ? Spotify.search(song, token) : Bacon.constant(null);

  return p_result.map(result =>
    _.extend({}, song, {
      spotify: result ? result.href : null,
      spotifyId: result ? result.id : null
    })
  );
}

export function getFipSongLists(Fip, Spotify, wsHost, radios, p_token) {
  const data = Fip.fetchFipRadios(wsHost, radios);
  const search = _.partial(searchOnSpotify, Spotify);

  return _.mapValues(data, radio => {
    return radio
      .flatMapLatest(item => {
        return p_token.flatMapLatest(token => {
          return item.type === "song"
            ? search(item.song, token).map(song => _.extend({}, item, { song }))
            : Bacon.constant(item);
        });
      })
      .scan([], (items, item) => [item].concat(items));
  });
}

export function getSpotifyPrint(Spotify, token) {
  const p_user = Spotify.getUser(token).toProperty();

  p_user.onError(res => {
    if (res.status === 401) {
      Spotify.refreshToken(token);
    }
  });

  const p_playlist = p_user
    .flatMapLatest(user =>
      Spotify.getOrCreatePlaylist(token, user.id, "fipradio")
    )
    .toProperty();

  return Bacon.combineTemplate({
    user: p_user,
    playlist: p_playlist,
    token: token
  });
}

export function getSyncs(Storage, Spotify, print) {
  const storageSync = Storage.sync("favorites");
  const spotifySync = !print
    ? null
    : Spotify.sync(print.token, print.user.id, print.playlist.id);

  return _.compact([storageSync, spotifySync]);
}

export function getFavoriteSongs(syncs) {
  const p_songLists = Bacon.zipAsArray(
    _.map(syncs, sync => sync.get())
  ).toProperty();

  return p_songLists
    .map(function(songLists) {
      const songs = _.flatten(songLists);
      return _.uniqBy(songs, song => song.spotifyId);
    })
    .toProperty();
}

export function setFavoriteSongs(syncs, songs) {
  if (typeof ga === "function") {
    ga(
      "send",
      "event",
      "favorites",
      "syncs",
      syncs.length > 1 ? "With Spotify" : "Without Spotify",
      songs.length
    );
  }

  return Bacon.zipAsArray(_.map(syncs, sync => sync.set(songs)));
}

export function updateFavSongs(songs, ev) {
  switch (ev.type) {
    case "add": {
      const song = _.extend({}, ev.song, { favorite: true });
      const exists = _.some(songs, s => s.id === song.id);

      return songs.concat(exists ? [] : [song]);
    }
    case "remove":
      return _.reject(songs, song => song.id === ev.song.id);
    default:
      console.error("Unknown type: " + ev.type); // eslint-disable-line no-console
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
  const favSongsById = _.keyBy(favSongs, "id");

  return _.map(items, item =>
    item.type != "song"
      ? item
      : _.extend({}, item, {
          song: _.extend({}, item.song, {
            favorite:
              _.has(favSongsById, item.song.id) ||
              _.has(favSongsById, item.song.spotifyId)
          })
        })
  );
}

export default (Storage, Spotify, Fip, wsHost, radios) => ({
  searchOnSpotify: _.partial(searchOnSpotify, Spotify),
  getFipSongLists: _.partial(getFipSongLists, Fip, Spotify, wsHost, radios),
  getSpotifyPrint: _.partial(getSpotifyPrint, Spotify),
  getSyncs: _.partial(getSyncs, Storage, Spotify),
  getFavoriteSongs,
  setFavoriteSongs,
  updateFavSongs,
  getFavSongsStream,
  mergeFavsAndSongs
});
