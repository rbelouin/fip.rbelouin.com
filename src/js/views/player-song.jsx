var React = require("react");

var Song = module.exports = React.createClass({
  getInitialState: function() {
    return {
      song: null
    };
  },
  componentDidMount: function() {
    this.props.p_song.onValue(function(song) {
      this.setState({song: song});
    }.bind(this));
  },
  render: function() {
    var song = this.state.song;

    return (song ?
      <div className="player-song"><strong className="player-song-title">{song.title}</strong> by <span className="player-song-artist">{song.artist}</span></div> :
      <div className="player-song">Loading...</div>
    );
  }
});
