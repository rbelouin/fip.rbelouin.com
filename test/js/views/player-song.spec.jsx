var test = require("tape");
var Bacon = require("baconjs");
var React = require("react");

var Song = require("../../../src/js/views/player-song.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

var song = require("../data.js").songs[0];

test("Song.loading should render a message, when waiting for a song", function(t) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <Song.loading {...intl} />,
    $main
  );

  t.equal(document.querySelector("main .song").textContent, intl.messages["loading"]);

  document.querySelector("main").remove();
  t.end();
});

test("Song.unknown should render a message, when the song information is not available", function(t) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <Song.unknown {...intl} />,
    $main
  );

  t.equal(document.querySelector("main .song .song-title").textContent, intl.messages["title-not-available"]);

  document.querySelector("main").remove();
  t.end();
});

test("Song should display the song information", function(t) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <Song song={song} {...intl} />,
    $main
  );

  t.equal(document.querySelector("main .song .song-title").textContent, song.title);
  t.equal(document.querySelector("main .song .song-artist").textContent, song.artist);
  t.equal(document.querySelector("main .song .song-album").textContent, song.album);
  t.equal(document.querySelector("main .song .song-year").textContent, song.year);
  t.equal(document.querySelector("main .song .song-label").textContent, song.label);

  document.querySelector("main").remove();
  t.end();
});
