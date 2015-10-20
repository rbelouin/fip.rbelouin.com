var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

exports.start = function(conf) {
  var intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  var SongModel = require("./models/song.js");

  var p_songs = SongModel
    .fetch("/api/songs/current", conf.FetchInterval);

  var favBus = SongModel.favBus;

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
        p_paneIsOpen={p_paneIsOpen}
        p_songs={p_songs}
        favBus={favBus}
        {...intl}
      />,
      document.querySelector("#app")
    );
  });
};
