var test = require("tape");
var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var Bacon = require("baconjs");
var _ = require("lodash");

var App = require("../../../src/js/views/app.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderApp(p_route, favBus) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  favBus = favBus || new Bacon.Bus();

  React.render(
    <App {...intl} url="/api/songs" p_songs={Bacon.constant([])} favBus={favBus} p_route={p_route} p_paneIsOpen={Bacon.constant(false)} p_favSongs={Bacon.constant([])} />,
    $main
  );
}

function cleanApp() {
  document.querySelector("main").remove();
}

test("App should display the Intro component", function(t) {
  renderApp(Bacon.constant("radio"));

  t.notEqual(document.querySelector("main .app .intro"), null);

  cleanApp();
  t.end();
});

test("App should hide the Intro and display the Player once the user asked for playing the radio", function(t) {
  renderApp(Bacon.constant("radio"));

  ReactTestUtils.Simulate.click(document.querySelector("main .app .intro .intro-play"));

  t.equal(document.querySelector("main .app .intro"), null);
  t.notEqual(document.querySelector("main .app .player"), null);

  cleanApp();
  t.end();
});
