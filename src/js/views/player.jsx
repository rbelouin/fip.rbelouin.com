var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var Song = require("./player-song.jsx");
var SongList = require("./player-song-list.jsx");
var Controls = require("./player-controls.jsx");

var Player = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var p_song = this.props.p_songs.map(_.head);
    var p_played = this.props.p_songs.map(_.tail);

    return (
      <div className="player row">
        <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
          <Song p_song={p_song} />
          <Controls url={this.props.url} />
          <SongList p_songs={p_played} />
        </div>
      </div>
    );
  }
});
