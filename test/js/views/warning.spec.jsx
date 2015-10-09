var test = require("tape");
var React = require("react");

var NoAudioWarning = require("../../../src/js/views/warning.jsx").NoAudioWarning;
var NoMPEGWarning = require("../../../src/js/views/warning.jsx").NoMPEGWarning;
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderWarning(component) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    component,
    $main
  );
}

function cleanWarning() {
  document.querySelector("main").remove();
}

test("NoAudioWarning should display a FIP link", function(t) {
  renderWarning(<NoAudioWarning {...intl} />);

  t.equal(document.querySelector(".alert-warning a").href, "http://fipradio.fr/player");
  t.end();

  cleanWarning();
});

test("NoMPEGWarning should display a FIP link", function(t) {
  renderWarning(<NoMPEGWarning {...intl} />);

  t.equal(document.querySelector(".alert-warning a").href, "http://fipradio.fr/player");
  t.end();

  cleanWarning();
});
