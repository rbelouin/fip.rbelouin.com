var _ = require("lodash");
var React = require("react");

var Song = require("./player-song.jsx");
var SongList = require("./player-song-list.jsx");

var Player = module.exports = React.createClass({
  render: function() {
    var p_song = this.props.p_songs.map(_.head);
    var p_played = this.props.p_songs.map(_.tail);

    return (
      <div className="player">
        <Song p_song={p_song} />
        <audio src={this.props.url} autoPlay controls />
        <SongList p_songs={p_played} />
      </div>
    );
  }
});
