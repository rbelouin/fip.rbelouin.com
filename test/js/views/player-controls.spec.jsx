var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactTestUtils = require("react/lib/ReactTestUtils.js");

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

test("Controls should not display the favorite button on invalid song data", function(t) {
  renderControls("url", null);

  t.equal(document.querySelector("main .player-controls .player-controls-favorite"), null);

  cleanControls();
  t.end();
});
