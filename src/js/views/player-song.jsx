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

    return song ? (
      <div className="player-song">
        <div>
          <strong className="player-song-title">{song.title}</strong> by <span className="player-song-artist">{song.artist}</span>
        </div>
        <div>
          <span className="player-song-album">{song.album}</span> (<span className="player-song-year">{song.year}</span>), by <span className="player-song-label">{song.label}</span>
        </div>
      </div>
    ) : (
      <div className="player-song">Loading...</div>
    );
  }
});
