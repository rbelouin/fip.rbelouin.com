var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");

var SongList = require("../../../src/js/views/player-song-list.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

var favorites = require("../data.js").favorites;
var songs = _.map(require("../data.js").songs, function(song) {
  return _.extend({}, song, {
    favorite: _.contains(favorites, song.id)
  });
});

function renderHistory(p_songs, favBus, favStream) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  favBus = favBus || new Bacon.Bus();
  favStream = favStream || favBus.map(function(ev) {
    if(ev.type === "add") {
      return _.extend({}, ev, {type: "added"});
    }
    else if(ev.type === "remove") {
      return _.extend({}, ev, {type: "removed"});
    }
    else {
      return new Bacon.Error("Unknown type: " + ev.type);
    }
  });

  React.render(
    <SongList p_songs={p_songs} favBus={favBus} favStream={favStream} {...intl} />,
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
    t.equal(_.contains(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(1)").classList, "player-history-favorite"), song.favorite);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(2)").textContent, song.title);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(3)").textContent, song.artist);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(4)").textContent, song.album);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(5)").textContent, song.year);
    t.equal(document.querySelector("main .player-history tbody tr:nth-child(" + (index + 1) + ") td:nth-child(6)").textContent, song.label);
  });

  cleanHistory();
  t.end();
});
