var _ = require("lodash");
var qs = require("querystring");
var Bacon = window.Bacon = require("baconjs");
require("bacon-routes");
var React = require("react");
var Intl = window.Intl = require("intl");
var IntlMixin = require("react-intl").IntlMixin;

exports.start = function(conf) {
  var intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  var SongModel = require("./models/song.js");
  var SpotifyModel = require("./models/spotify.js");

  var p_songs = SongModel
    .fetch("/api/songs/current", conf.FetchInterval);

  var favBus = SongModel.favBus;
  var volBus = new Bacon.Bus();
  var syncBus = new Bacon.Bus();

  var params = qs.parse(window.location.search.slice(1));

  if(_.has(params, "refresh_token")) {
    localStorage.refresh_token = params.refresh_token;
  }

  if(_.has(params, "access_token")) {
    localStorage.access_token = params.access_token;
    localStorage.expires_in = params.expires_in;
    localStorage.token_type = params.token_type;

    window.location.search = "";
  }

  var p_user = syncBus.toProperty(typeof localStorage.access_token === "string")
    .flatMapLatest(function(sync) {
      if(!sync) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("token_type");
        return Bacon.once(null);
      }
      else {
        var access_token = params.access_token || localStorage.access_token;

        if(!access_token) {
          window.location.href = window.location.protocol + "//" + window.location.host + "/api/login?" + qs.stringify({
            redirect_uri: window.location.href,
            scope: ["user-library-read", "playlist-read-private", "playlist-modify-private"]
          });
        }
        else {
          return SpotifyModel.getUser(localStorage.access_token).flatMapError(function() {
            window.location.href = window.location.protocol + "//" + window.location.host + "/api/login?" + qs.stringify({
              redirect_uri: window.location.href,
              refresh_token: localStorage.refresh_token
            })
          }).toProperty();
        }
      }
    }).toProperty();

  var p_playlist = p_user
  .filter(function(user) {
    return user;
  })
  .flatMapLatest(function(user) {
    return SpotifyModel.getOrCreatePlaylist(localStorage.access_token, user.id, "fipradio");
  }).toProperty();

  var p_tracks =  p_user.flatMapLatest(function(user) {
    return !user ? Bacon.constant([]) : p_playlist.flatMapLatest(function(playlist) {
      return SpotifyModel.getPlaylistTracks(localStorage.access_token, user.id, playlist.id).toProperty();
    });
  }).toProperty();

  var p_spotifySongs = p_tracks.map(function(data) {
    var tracks = _.pluck(data, "track");
    return _.map(tracks, function(track) {
      return {
        id: track.id,
        title: track.name,
        artist: _.pluck(track.artists, "name").join("/"),
        album: track.album.name,
        spotify: track.external_urls.spotify,
        spotifyId: track.id,
        icons: {
          medium: _.first(track.album.images).url
        }
      };
    });
  });

  var p_favSongs = p_spotifySongs.flatMapLatest(function(songs) {
    var savedSongs = SongModel.getFavorites();
    var allSongs = _.uniq(savedSongs.concat(songs), "spotifyId");

    SongModel.setFavorites(allSongs);
    return SongModel.favSongs.changes().toProperty(SongModel.getFavorites()).flatMapLatest(function(songs) {
      return p_user.flatMapLatest(function(user) {
        return p_playlist.flatMapLatest(function(playlist) {
          return !user || _.isEmpty(songs) ? Bacon.once(songs) : SpotifyModel.setTracksToPlaylist(localStorage.access_token, user.id, playlist.id, _(songs).pluck("spotifyId").compact().value()).map(songs);
        });
      });
    });
  }).toProperty();

  var routes = Bacon.fromRoutes({
    routes: conf.routes
  });

  routes.errors.onValue(function() {
    Bacon.history.pushState(null, null, "/");
  });

  var p_route = _.foldl(routes, function(p_route, stream, name) {
    return name === "errors" ? p_route : p_route.merge(stream.map(name));
  }, Bacon.never());

  var App = require("./views/app.jsx");

  window.addEventListener("load", function() {
    var s_click = Bacon.fromEvent(
      document.querySelector(".navbar .navbar-brand a"),
      "click"
    );

    var p_paneIsOpen = s_click.doAction(".preventDefault")
                              .scan(false, function(isOpen) {
                                return !isOpen;
                              });

    React.render(
      <App
        url="/api/songs"
        p_route={p_route}
        p_paneIsOpen={p_paneIsOpen}
        p_songs={p_songs}
        p_favSongs={p_favSongs}
        p_user={p_user}
        syncBus={syncBus}
        favBus={favBus}
        volBus={volBus}
        {...intl}
      />,
      document.querySelector("#app")
    );

    Bacon.history.pushState(null, null, window.location.pathname + window.location.search);
  });
};
