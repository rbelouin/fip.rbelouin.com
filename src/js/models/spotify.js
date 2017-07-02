import _ from "lodash";
import qs from "querystring";
import Bacon from "baconjs";

export const host = "https://api.spotify.com/v1";

export function getAuthorization(token) {
  return token ? token.token_type + " " + token.access_token : "";
}

export function fetchAndFollow(send, token, url) {
  const req = {
    method: "GET",
    url: url,
    headers: {
      "Authorization": getAuthorization(token)
    }
  };

  return send(req).flatMapLatest(function(res) {
    return Bacon.once(res).merge(res.next ?
      fetchAndFollow(send, token, res.next) :
      Bacon.never()
    );
  });
}

export function search(send, {title, artist, album}, token) {
  const query = `track:${title}+artist:${artist}+album:${album}`;

  const p_result = send({
    method: "GET",
    url: host + "/search?type=track&q=" + query,
    headers: {
      "Authorization": getAuthorization(token)
    }
  });

  return p_result.map(function(result) {
    var firstItem = result && result.tracks.items[0];
    var href = firstItem && firstItem.external_urls.spotify;

    return firstItem && {
      href: href,
      id: firstItem.id
    };
  });
}

export function requestToken(location, scope) {
  location.href = "/api/login?" + qs.stringify({
    redirect_uri: location.href,
    scope
  });
}

export function refreshToken(location, token) {
  location.href = "/api/login?" + qs.stringify({
    redirect_uri: location.href,
    refresh_token: token.refresh_token
  });
}

export function getUser(send, token) {
  return send({
    method: "GET",
    url: `${host}/me`,
    headers: {
      "Authorization": getAuthorization(token)
    }
  });
}

export function getPlaylists(send, token, userId) {
  const url = `${host}/users/${userId}/playlists?limit=50`;
  const s_playlists = fetchAndFollow(send, token, url);

  return s_playlists.fold([], function(playlists, res) {
    return playlists.concat(res.items);
  });
}

export function createPlaylist(send, token, userId, name, isPublic) {
  const url = `${host}/users/${userId}/playlists`;

  return send({
    method: "POST",
    url: url,
    headers: {
      "Authorization": getAuthorization(token),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "public": isPublic
    })
  });
}

export function getOrCreatePlaylist(send, token, userId, name) {
  const p_playlists = getPlaylists(send, token, userId);

  return p_playlists.flatMapLatest(function(playlists) {
    const playlist = _.find(playlists, function(playlist) {
      return playlist.name === name;
    });

    return playlist ?
      Bacon.once(playlist) :
      createPlaylist(send, token, userId, name, false);
  }).toProperty();
}

export function getPlaylistTracks(send, token, userId, playlistId) {
  const url = `${host}/users/${userId}/playlists/${playlistId}/tracks?limit=50`;

  const s_tracks = fetchAndFollow(send, token, url);

  return s_tracks.fold([], function(tracks, res) {
    return tracks.concat(_.pluck(res.items, "track").map(track => ({
      id: track.id,
      title: track.name,
      artist: _.pluck(track.artists, "name").join("/"),
      album: track.album.name,
      favorite: true,
      spotify: track.external_urls.spotify,
      spotifyId: track.id,
      icons: {
        medium: _.first(track.album.images).url
      }
    })));
  });
}

export function setPlaylistTracks(send, token, userId, playlistId, trackIds) {
  const url = `${host}/users/${userId}/playlists/${playlistId}/tracks`;

  return send({
    method: "PUT",
    url: url,
    headers: {
      "Authorization": getAuthorization(token),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uris: _.map(trackIds, trackId => "spotify:track:" + trackId)
    })
  });
}

export function sync(send, token, userId, playlistId) {
  return {
    get: function() {
      return getPlaylistTracks(send, token, userId, playlistId);
    },
    set: function(songs) {
      return setPlaylistTracks(send, token, userId, playlistId, _(songs).pluck("spotifyId").compact().value());
    }
  };
}

export default (Http, location) => ({
  host,
  getAuthorization,
  fetchAndFollow: _.partial(fetchAndFollow, Http.send),
  search: _.partial(search, Http.send),
  requestToken: _.partial(requestToken, location),
  refreshToken: _.partial(refreshToken, location),
  getUser: _.partial(getUser, Http.send),
  getPlaylists: _.partial(getPlaylists, Http.send),
  createPlaylist: _.partial(createPlaylist, Http.send),
  getOrCreatePlaylist: _.partial(getOrCreatePlaylist, Http.send),
  getPlaylistTracks: _.partial(getPlaylistTracks, Http.send),
  setPlaylistTracks: _.partial(setPlaylistTracks, Http.send),
  sync: _.partial(sync, Http.send)
});
