var test = require("tape");
var React = require("react");
var Bacon = require("baconjs");
var _ = require("lodash");

var App = require("../../../src/js/views/app.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderApp(favBus, favStream) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

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
    <App {...intl} url="/api/songs" p_songs={Bacon.constant([])} favBus={favBus} favStream={favStream} />,
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
