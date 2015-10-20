var _ = require("lodash");
var Bacon = window.Bacon = require("baconjs");
require("bacon-routes");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

exports.start = function(conf) {
  var intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  var SongModel = require("./models/song.js");

  var p_songs = SongModel
    .fetch("/api/songs/current", conf.FetchInterval);

  var p_favSongs = SongModel.favSongs;

  var favBus = SongModel.favBus;

  var routes = Bacon.fromRoutes({
    routes: {
      favorites:  "/users/me/songs",
      radio:      "/"
    }
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
        favBus={favBus}
        {...intl}
      />,
      document.querySelector("#app")
    );

    Bacon.history.pushState(null, null, window.location.pathname);
  });
};
