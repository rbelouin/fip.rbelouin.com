var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Intro = require("./intro.jsx");
var Player = require("./player.jsx");

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      play: false
    };
  },
  onPlay: function() {
    this.setState({
      play: true
    });
  },
  render: function() {
    return (
      <div className="app">
        {
          this.state.play ? (
            <Player url={this.props.url} p_songs={this.props.p_songs} favStream={this.props.favStream} favBus={this.props.favBus} />
          ) : (
            <Intro onPlay={this.onPlay} />
          )
        }
      </div>
    );
  }
});
