var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var Controls = module.exports = React.createClass({
  componentDidMount: function() {
    var controls = React.findDOMNode(this);
    var audio = controls.querySelector("audio");
    var input = controls.querySelector("input");
    var icon = controls.querySelector(".player-controls-volume-icon");

    var p_volume = Bacon.fromEventTarget(input, "input").map(function(e) {
      return e.target.value;
    }).toProperty(input.value);

    var p_icon = p_volume.map(function(volume) {
      return  volume == 0 ? "off" :
              volume > 50 ? "up" :
                            "down";
    }).skipDuplicates();

    p_volume.onValue(function(volume) {
      audio.volume = volume / 100;
    });

    p_icon.onValue(function(iconName) {
      icon.className = _.map(icon.classList, function(className) {
        var isIconClass = className.indexOf("glyphicon-volume-") == 0;
        return isIconClass ? "glyphicon-volume-" + iconName : className;
      }).join(" ");
    });
  },
  render: function() {
    return (
      <div className="player-controls">
        <audio src={this.props.url} autoPlay />
        <span className="player-controls-volume-icon glyphicon glyphicon-volume-up"></span>
        <input type="range" name="volume" />
      </div>
    );
  }
});
