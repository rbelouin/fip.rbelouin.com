var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

exports.start = function(conf) {
  var intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  var SongModel = window.SongModel = require("./models/song.js");

  var p_songs = SongModel
    .fetch("/api/songs/current", conf.FetchInterval);

  var favStream = window.favStream = SongModel.favStream;
  var favBus = window.favBus = SongModel.favBus;

  var App = require("./views/app.jsx");

  window.addEventListener("load", function() {
    React.render(
      <App url="/api/songs" p_songs={p_songs} favStream={favStream} favBus={favBus} {...intl} />,
      document.querySelector("main")
    );
  });
};
