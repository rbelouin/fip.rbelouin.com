var _ = require("lodash");
var Bacon = require("baconjs");

var SpotifyModel = module.exports;

var send = function(verb, url, access_token, data) {
  return Bacon.fromPromise(fetch(url, {
    method: verb,
    headers: {
      "Authorization": access_token ? "Bearer " + access_token : "",
      "Content-Type": "application/json"
    },
    body: data
  })).flatMapLatest(function(res) {
    var isJson = res.headers.has("Content-Type") && res.headers.get("Content-Type").split(";")[0] === "application/json";

    return  res.ok && isJson ? Bacon.fromPromise(res.json()) :
            res.ok ? Bacon.once(res) :
            Bacon.once(new Bacon.Error(res));
  }).toProperty();
};

var fetchAndFollow = function(url, access_token) {
  return send("GET", url, access_token).flatMapLatest(function(res) {
    return Bacon.once(res).merge(res.next ? fetchAndFollow(res.next, access_token) : Bacon.never());
  });
};

SpotifyModel.getUser = function(access_token) {
  return send("GET", "https://api.spotify.com/v1/me", access_token);
};

SpotifyModel.getPlaylists = function(access_token, userId) {
  return fetchAndFollow("https://api.spotify.com/v1/users/" + userId + "/playlists?limit=50", access_token).fold([], function(playlists, res) {
    return playlists.concat(res.items);
  });
};

SpotifyModel.getPlaylistTracks = function(access_token, userId, playlistId) {
  return fetchAndFollow("https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks?limit=50", access_token).fold([], function(tracks, res) {
    return tracks.concat(res.items);
  });
};

SpotifyModel.createPlaylist = function(access_token, userId, name, isPublic) {
  return send("POST", "https://api.spotify.com/v1/users/" + userId + "/playlists", access_token, JSON.stringify({
    "name": name,
    "public": isPublic
  }));
};

SpotifyModel.getOrCreatePlaylist = function(access_token, userId, name) {
  return SpotifyModel.getPlaylists(access_token, userId).flatMapLatest(function(playlists) {
    var playlist = _.find(playlists, function(playlist) {
      return playlist.name === name;
    });

    return playlist ? Bacon.once(playlist) : SpotifyModel.createPlaylist(access_token, userId, name, false);
  }).toProperty();
};

SpotifyModel.setTracksToPlaylist = function(access_token, userId, playlistId, trackIds) {
  return send("PUT", "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks", access_token, JSON.stringify({
    uris: _.map(trackIds, function(trackId) {
      return "spotify:track:" + trackId;
    })
  }));
};

SpotifyModel.search = function(song) {
  function search(query) {
    var p_result = send("GET", "https://api.spotify.com/v1/search?type=track&q=" + _.map(query, function(value, name) {
      return name + ":" + encodeURIComponent(value);
    }).join("+"));

    return p_result.map(function(result) {
      var firstItem = result && result.tracks.items[0];
      var href = firstItem && firstItem.external_urls.spotify;

      return firstItem && {
        href: href,
        id: firstItem.id
      };
    });
  }

  var query = {
    track: song.title,
    artist: song.artist,
    album: song.album
  };

  return search(query);
};

;
