var _ = require("lodash");
var qs = require("querystring");
var Bacon = window.Bacon = require("baconjs");
require("bacon-routes");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

exports.start = function(conf) {
  var intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  var SongModel = require("./models/song.js");
  var SpotifyModel = require("./models/spotify.js");

  var p_songs = SongModel
    .fetch("/api/songs/current", conf.FetchInterval);

  var p_favSongs = SongModel.favSongs;

  var favBus = SongModel.favBus;
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
          return SpotifyModel.getUser(localStorage.access_token).toProperty();
        }
      }
    });

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
        {...intl}
      />,
      document.querySelector("#app")
    );

    Bacon.history.pushState(null, null, window.location.pathname + window.location.search);
  });
};
