var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Player = require("./player.jsx");

var Radio = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <Player
        pastSongs={this.props.pastSongs}
        nowPlaying={this.props.nowPlaying}
        favBus={this.props.favBus}
      />
    );
  }
});
