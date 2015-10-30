var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Intro = require("./intro.jsx");
var Player = require("./player.jsx");

var Radio = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return this.props.play ? (
      <Player
        songs={this.props.songs}
        favBus={this.props.favBus}
        volBus={this.props.volBus}
        volume={this.props.volume}
      />
    ) : (
      <Intro onPlay={this.props.onPlay} />
    )
  }
});
