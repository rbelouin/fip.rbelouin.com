var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var intl = require("./models/intl.js").getIntlData("en");
var SongModel = require("./models/song.js");

var p_songs = SongModel.fetch("/api/songs/current", 2000);

var Player = require("./views/player.jsx");

var App = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <Player url="/api/songs" p_songs={p_songs} {...intl} />
    );
  }
});

window.addEventListener("load", function() {
  React.render(
    <App />,
    document.querySelector("main")
  );
});
