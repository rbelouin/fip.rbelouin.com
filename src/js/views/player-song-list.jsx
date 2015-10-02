var _ = require("lodash");
var React = require("react");

var SongItem = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td>{this.props.artist}</td>
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
        <SongItem title={song.title} artist={song.artist} />
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
          </tr>
        </thead>
        <tbody>
          {songNodes}
        </tbody>
      </table>
    );
  }
});
