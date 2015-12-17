import _ from "lodash";
import Bacon from "baconjs";

import Fip from "../models/fip.js";
import Spotify from "../models/spotify.js";
import Storage from "../models/storage.js";

export function searchOnSpotify(Spotify, song) {
  return Spotify.search(song).map(result => _.extend({}, song, {
    spotify: result ? result.href : null,
    spotifyId: result ? result.id : null
  }));
}

export function getFipSongList(Fip, Spotify, location) {
  return Fip.fetchFipSongs("ws://" + location.host + "/api/ws/songs")
    .flatMapLatest(_.partial(searchOnSpotify, Spotify))
    .scan([], (songs, song) => [song].concat(songs));
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

export function mergeFavsAndSongs(songs, favSongs) {
  const favSongsById = _.indexBy(favSongs, "id");

  return _.map(songs, song => song && _.extend({}, song, {
    favorite: _.has(favSongsById, song.id) || _.has(favSongsById, song.spotifyId)
  }));
}

export function getState(Storage, Spotify, Fip, location, favBus, token) {
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

  const p_songs = Bacon.combineWith(
    mergeFavsAndSongs,
    getFipSongList(Fip, Spotify, location),
    p_favSongs
  );

  const p_pastSongs = p_songs.map(_.tail);

  const p_nowPlaying = p_songs
    .map(songs => _.isEmpty(songs) ? {type: "loading"} : {type: "song", song: _.head(songs)})
    .flatMapError(data => Bacon.once(data && data.error && data.error.code === 100 ? {type: "unknown"} : new Bacon.Error(error)))
    .toProperty();

  return Bacon.combineTemplate({
    user: p_print.map(print => print && print.user),
    favSongs: p_favSongs,
    pastSongs: p_pastSongs,
    nowPlaying: p_nowPlaying,
    songs: p_songs
  });
}

export default {
  searchOnSpotify: _.partial(searchOnSpotify, Spotify),
  getFipSongList: _.partial(getFipSongList, Fip, Spotify, window.location),
  getSpotifyPrint: _.partial(getSpotifyPrint, Spotify),
  getSyncs: _.partial(getSyncs, Storage, Spotify),
  getFavoriteSongs,
  setFavoriteSongs,
  updateFavSongs,
  getFavSongsStream,
  mergeFavsAndSongs,
  getState: _.partial(getState, Storage, Spotify, Fip, window.location)
}
