var test = require("tape");
var React = require("react");
var ReactTestUtils = require("react/lib/ReactTestUtils.js");
var Bacon = require("baconjs");
var _ = require("lodash");

var App = require("../../../src/js/views/app.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderApp(p_route, favBus, volBus) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  favBus = favBus || new Bacon.Bus();
  volBus = volBus || new Bacon.Bus();

  React.render(
    <App {...intl} url="/api/songs" p_songs={Bacon.constant([])} favBus={favBus} p_route={p_route} p_paneIsOpen={Bacon.constant(false)} p_favSongs={Bacon.constant([])} p_user={Bacon.constant(null)} volBus={volBus} />,
    $main
  );
}

function cleanApp() {
  document.querySelector("main").remove();
}

test("App should display the Player once the user asked for playing the radio", function(t) {
  renderApp(Bacon.constant("radio"));

  t.notEqual(document.querySelector("main .app .player"), null);

  cleanApp();
  t.end();
});
