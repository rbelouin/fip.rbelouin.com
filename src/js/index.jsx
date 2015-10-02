var React = require("react");

var SongModel = require("./models/song.js");

var p_songs = SongModel.fetch("/api/songs/current", 2000);

var Player = require("./views/player.jsx");

window.addEventListener("load", function() {
  React.render(
    <Player url="/api/songs" p_songs={p_songs} />,
    document.querySelector("main")
  );
});
