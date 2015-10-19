var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var Controls = require("../../../src/js/views/player-controls.jsx");

var intl = require("../../../src/js/models/intl.js").getIntlData("en");
var song = require("../data.js").songs[0];

function renderControls(url, p_song, favBus, favStream) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  p_song = p_song || Bacon.constant(song);
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
    <Controls url="" {...intl} p_song={p_song} favBus={favBus} favStream={favStream} />,
    $main
  );
}

function cleanControls() {
  document.querySelector("main").remove();
}

test("Controls render an audio tag", function(t) {
  renderControls("url");

  t.notEqual(document.querySelector("main audio"), null);

  cleanControls();
  t.end();
});

test("Controls render a range input tag for volume", function(t) {
  renderControls("url");

  t.notEqual(document.querySelector("main input[type='range']"), null);

  cleanControls();
  t.end();
});

test("Changing the input range value changes the volume", function(t) {
  renderControls("url");

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

test("Controls updates the favorite button", function(t) {
  var p_song = Bacon.constant(_.extend({}, song, {
    favorite: false
  }));

  var favBus = new Bacon.Bus();

  renderControls("url", p_song, favBus);

  favBus.push({type: "add", song: song.id});

  t.notEqual(document.querySelector("main .player-controls .player-controls-favorite.player-controls-favorite-added"), null);

  favBus.push({type: "remove", song: song.id});

  t.notEqual(document.querySelector("main .player-controls .player-controls-favorite"), null);
  t.equal(document.querySelector("main .player-controls .player-controls-favorite.player-controls-favorite-added"), null);

  cleanControls();
  t.end();
});
