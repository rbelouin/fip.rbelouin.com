var React = require("react");
var Bacon = require("baconjs");

var Controls = module.exports = React.createClass({
  componentDidMount: function() {
    var controls = React.findDOMNode(this);
    var audio = controls.querySelector("audio");
    var input = controls.querySelector("input");

    var p_volume = Bacon.fromEventTarget(input, "input").map(function(e) {
      return e.target.value;
    }).toProperty(input.value);

    p_volume.onValue(function(volume) {
      audio.volume = volume / 100;
    });
  },
  render: function() {
    return (
      <div className="player-controls">
        <audio src={this.props.url} autoPlay />
        <input type="range" name="volume" />
      </div>
    );
  }
});
