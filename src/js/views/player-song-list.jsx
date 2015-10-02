var _ = require("lodash");
var React = require("react");

var SongItem = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.song.title}</td>
        <td>{this.props.song.artist}</td>
        <td>{this.props.song.album}</td>
        <td>{this.props.song.year}</td>
        <td>{this.props.song.label}</td>
      </tr>
    );
  }
});

var SongList = module.exports = React.createClass({
  getInitialState: function() {
    return {
      songs: []
    };
  },
  componentDidMount: function() {
    this.props.p_songs.onValue(function(songs) {
      this.setState({songs: songs});
    }.bind(this));
  },
  render: function() {
    var songNodes = this.state.songs.map(function(song) {
      return (
        <SongItem song={song} />
      );
    });

    return _.isEmpty(this.state.songs) ? (
      <table className="player-song-history"></table>
    ) : (
      <table className="player-song-history">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Year</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {songNodes}
        </tbody>
      </table>
    );
  }
});
