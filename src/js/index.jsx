var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var SongModel = require("./models/song.js");

var p_songs = SongModel.fetch("/api/songs/current", 2000);

var Player = require("./views/player.jsx");

var intlEn = require("./messages/en-US.json");
var intlFr = require("./messages/fr-FR.json");

var languages = typeof navigator != "undefined" && navigator.languages || ["fr-FR", "fr"];

var intl = _.find(languages, function(l) {
  return l.split("-")[0] == "fr";
}) ? intlFr : intlEn;

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
