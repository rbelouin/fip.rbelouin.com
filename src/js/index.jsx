var React = require("react");

var Player = require("./views/player.jsx");

window.addEventListener("load", function() {
  React.render(
    <Player url="/api/songs" />,
    document.querySelector("main")
  );
});
