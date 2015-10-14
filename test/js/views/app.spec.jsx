var test = require("tape");
var React = require("react");
var Bacon = require("baconjs");

var App = require("../../../src/js/views/app.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderApp() {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <App {...intl} url="/api/songs" p_songs={Bacon.constant([])} />,
    $main
  );
}

function cleanApp() {
  document.querySelector("main").remove();
}

test("App should display the Intro component", function(t) {
  renderApp();

  t.notEqual(document.querySelector("main .app .intro"), null);

  cleanApp();
  t.end();
});

test("App should hide the Intro and display the Player once the user asked for playing the radio", function(t) {
  renderApp();

  document.querySelector("main .app .intro .intro-play").dispatchEvent(new Event("click"));

  t.equal(document.querySelector("main .app .intro"), null);
  t.notEqual(document.querySelector("main .app .player"), null);

  cleanApp();
  t.end();
});
