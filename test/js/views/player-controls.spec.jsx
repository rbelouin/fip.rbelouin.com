var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var Controls = require("../../../src/js/views/player-controls.jsx");

var intl = require("../../../src/js/models/intl.js").getIntlData("en");
var song = require("../data.js").songs[0];

function renderControls(url, song, favBus) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  favBus = favBus || new Bacon.Bus();

  React.render(
    <Controls url="" {...intl} song={song} favBus={favBus} />,
    $main
  );
}

function cleanControls() {
  document.querySelector("main").remove();
}

test("Controls render an audio tag", function(t) {
  renderControls("url", song);

  t.notEqual(document.querySelector("main audio"), null);

  cleanControls();
  t.end();
});

test("Controls render a range input tag for volume", function(t) {
  renderControls("url", song);

  t.notEqual(document.querySelector("main input[type='range']"), null);

  cleanControls();
  t.end();
});

test("Changing the input range value changes the volume", function(t) {
  renderControls("url", song);

  var input = document.querySelector("main input[type='range']");
  var audio = document.querySelector("main audio");

  input.value = "0";
  input.dispatchEvent(new Event("input"));
  t.equal(audio.volume, 0);

  input.value = "50";
  input.dispatchEvent(new Event("input"));
  t.equal(audio.volume, 0.5);

  input.value = "100";
  input.dispatchEvent(new Event("input"));
  t.equal(audio.volume, 1);

  cleanControls();
  t.end();
});

test("Controls display a favorite button", function(t) {
  renderControls("url", _.extend({}, song, {
    favorite: true
  }));

  t.notEqual(document.querySelector("main .player-controls .player-controls-favorite.player-controls-favorite-added"), null);

  cleanControls();

  renderControls("url", _.extend({}, song, {
    favorite: false
  }));

  t.notEqual(document.querySelector("main .player-controls .player-controls-favorite"), null);
  t.equal(document.querySelector("main .player-controls .player-controls-favorite.player-controls-favorite-added"), null);

  cleanControls();
  t.end();
});
