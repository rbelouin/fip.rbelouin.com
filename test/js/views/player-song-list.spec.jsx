var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");

var SongList = require("../../../src/js/views/player-song-list.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

var songs = require("../data.js").songs;

function renderHistory(p_songs) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <SongList p_songs={p_songs} {...intl} />,
    $main
  );
}

function cleanHistory() {
  document.querySelector("main").remove();
}

test("SongList should display one row per song", function(t) {
  renderHistory(Bacon.constant(songs));

  t.equal(document.querySelectorAll("main .player-history tbody tr").length, songs.length);

  cleanHistory();
  t.end();
});

test("SongList should display the information of every song", function(t) {
  renderHistory(Bacon.constant(songs));

  _.each(songs, function(song, index) {
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(1)").textContent, song.title);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(2)").textContent, song.artist);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(3)").textContent, song.album);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(4)").textContent, song.year);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(5)").textContent, song.label);
  });

  cleanHistory();
  t.end();
});
