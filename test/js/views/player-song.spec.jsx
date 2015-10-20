var test = require("tape");
var Bacon = require("baconjs");
var React = require("react");

var Song = require("../../../src/js/views/player-song.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

var song = require("../data.js").songs[0];

function renderSong(song) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <Song song={song} {...intl} />,
    $main
  );
}

function cleanSong() {
  document.querySelector("main").remove();
}

test("Song should render a message, when waiting for a song", function(t) {
  renderSong();
  t.equal(document.querySelector("main .player-song").textContent, intl.messages["loading"]);

  cleanSong();
  t.end();
});

test("Song should display the song information", function(t) {
  renderSong(song);

  t.equal(document.querySelector("main .player-song .player-song-title").textContent, song.title);
  t.equal(document.querySelector("main .player-song .player-song-artist").textContent, song.artist);
  t.equal(document.querySelector("main .player-song .player-song-album").textContent, song.album);
  t.equal(document.querySelector("main .player-song .player-song-year").textContent, song.year);
  t.equal(document.querySelector("main .player-song .player-song-label").textContent, song.label);

  cleanSong();
  t.end();
});
