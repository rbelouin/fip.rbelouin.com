var test = require("tape");
var React = require("react");
var ReactTestUtils = require("react/lib/ReactTestUtils.js");

var Intro = require("../../../src/js/views/intro.jsx");
var intl = require("../../../src/js/models/intl.js").getIntlData("en");

function renderIntro(onPlay) {
  var $main = document.createElement("main");
  document.body.appendChild($main);

  React.render(
    <Intro {...intl} onPlay={onPlay}/>,
    $main
  );
}

function cleanIntro() {
  document.querySelector("main").remove();
}

test("Intro should display a baseline", function(t) {
  renderIntro(function(){});

  t.equal(document.querySelector("main .intro .intro-baseline").textContent, intl.messages["intro-baseline"]);

  cleanIntro();
  t.end();
});

test("Intro should display a play button", function(t) {
  renderIntro(function(){});

  t.notEqual(document.querySelector("main .intro .intro-play"), null);

  cleanIntro();
  t.end();
});

test("Intro should call the onPlay callback when the user clicks on the play button", function(t) {
  var called = false;

  renderIntro(function() {
    called = true;
  });

  ReactTestUtils.Simulate.click(document.querySelector("main .intro .intro-play"));

  setTimeout(function() {
    t.ok(called);

    cleanIntro();
    t.end();
  }, 100);
});
