var test = require("tape");
var React = require("react");
var Controls = require("../../../src/js/views/player-controls.jsx");

var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderControls(url) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <Controls url="" {...intl} />,
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
