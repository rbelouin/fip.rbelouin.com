var test = require("tape");
var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var Player = require("../../../src/js/views/player.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

var songs = require("../data.js").songs;

function renderPlayer(p_songs, favBus, favStream) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  favBus = favBus || new Bacon.Bus();
  favStream = favStream || favBus.map(function(ev) {
    if(ev.type === "add") {
      return _.extend({}, ev, {type: "added"});
    }
    else if (ev.type === "remove") {
      return _.extend({}, ev, {type: "removed"});
    }
    else {
      return new Bacon.Error("Unknown type: " + ev.type);
    }
  });


  React.render(
    <Player p_songs={p_songs} favBus={favBus} favStream={favStream} {...intl} />,
    $main
  );
}

function cleanPlayer() {
  document.querySelector("main").remove();
}

test("Player should display the current song", function(t) {
  renderPlayer(Bacon.constant(songs));

  t.equal(document.querySelector("main .player .player-song .player-song-title").textContent, _.first(songs).title);
  t.equal(document.querySelector("main .player .player-song .player-song-artist").textContent, _.first(songs).artist);
  t.equal(document.querySelector("main .player .player-song .player-song-album").textContent, _.first(songs).album);
  t.equal(document.querySelector("main .player .player-song .player-song-year").textContent, _.first(songs).year);
  t.equal(document.querySelector("main .player .player-song .player-song-label").textContent, _.first(songs).label);

  cleanPlayer();
  t.end();
});

test("Player should display the controls", function(t) {
  renderPlayer(Bacon.constant(songs));

  t.notEqual(document.querySelector("main .player .player-controls"), null);

  cleanPlayer();
  t.end();
});

test("Player should display the history", function(t) {
  renderPlayer(Bacon.constant(songs));

  _.each(_.tail(songs), function(song, index) {
    t.equal(document.querySelector("main .player .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(1)").textContent, song.title);
    t.equal(document.querySelector("main .player .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(2)").textContent, song.artist);
    t.equal(document.querySelector("main .player .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(3)").textContent, song.album);
    t.equal(document.querySelector("main .player .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(4)").textContent, song.year);
    t.equal(document.querySelector("main .player .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(5)").textContent, song.label);
  });

  cleanPlayer();
  t.end();
});
