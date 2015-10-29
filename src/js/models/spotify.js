var _ = require("lodash");
var Bacon = require("baconjs");

var SpotifyModel = module.exports;

var send = function(verb, url, access_token, data) {
  return Bacon.fromBinder(function(sink) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        var ok = xhr.status >= 200 && xhr.status < 300;
        sink(ok ? JSON.parse(xhr.responseText) : new Bacon.Error(JSON.parse(xhr.responseText)));
        sink(new Bacon.End());
      }
    };

    xhr.open(verb, url);
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);

    return function() {
      xhr.abort();
    };
  });
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
