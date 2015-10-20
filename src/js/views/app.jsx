var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Intro = require("./intro.jsx");
var Player = require("./player.jsx");

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      play: false,
      songs: []
    };
  },
  onPlay: function() {
    this.setState({
      play: true,
      songs: []
    });

    this.props.p_songs.onValue(function(songs) {
      this.setState({
        play: true,
        songs: songs
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div className="app">
        {
          this.state.play ? (
            <Player url={this.props.url} songs={this.state.songs} favBus={this.props.favBus} />
          ) : (
            <Intro onPlay={this.onPlay} />
          )
        }
      </div>
    );
  }
});
