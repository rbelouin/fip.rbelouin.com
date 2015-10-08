var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

exports.start = function(conf) {
  var intl = require("./models/intl.js")
    .getIntlData(conf.DefaultLanguage);

  var SongModel = require("./models/song.js");

  var p_songs = SongModel
    .fetch("/api/songs/current", conf.FetchInterval)
    .delay(conf.FetchDelay);

  var Player = require("./views/player.jsx");

  window.addEventListener("load", function() {
    React.render(
      <Player url="/api/songs" p_songs={p_songs} {...intl} />,
      document.querySelector("main")
    );
  });
};
