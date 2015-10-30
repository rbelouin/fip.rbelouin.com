var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactTestUtils = require("react/lib/ReactTestUtils.js");

var Controls = require("../../../src/js/views/player-controls.jsx");

var intl = require("../../../src/js/models/intl.js").getIntlData("en");
var song = require("../data.js").songs[0];

function renderControls(url, song, favBus, volBus) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  favBus = favBus || new Bacon.Bus();
  volBus = volBus || new Bacon.Bus();

  React.render(
    <Controls url="" {...intl} song={song} favBus={favBus} volBus={volBus} />,
    $main
  );
}

function cleanControls() {
  document.querySelector("main").remove();
}

test("Controls render a range input tag for volume", function(t) {
  renderControls("url", song);

  t.notEqual(document.querySelector("main input[type='range']"), null);

  cleanControls();
  t.end();
});

test("Changing the input range value changes the volume", function(t) {
  var volBus = new Bacon.Bus();

  renderControls("url", song, volBus);

  var input = document.querySelector("main input[type='range']");

  volBus.take(1).onValue(function(volume) {
    t.equal(volume, 0);
  });

  input.value = "0";
  ReactTestUtils.Simulate.input(input);

  volBus.take(1).onValue(function(volume) {
    t.equal(volume, 0.5);
  });

  input.value = "50";
  ReactTestUtils.Simulate.input(input);

  volBus.take(1).onValue(function(volume) {
    t.equal(volume, 1);
  });

  input.value = "100";
  ReactTestUtils.Simulate.input(input);

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
