var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Song = module.exports = React.createClass({
  mixins: [IntlMixin],
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
  renderSongDetails: function(song) {
    return (
      <div className="player-song-details">
        <FormattedMessage
          message={this.getIntlMessage("song-details")}
          album={<span className="player-song-album">{song.album}</span>}
          year={<span className="player-song-year">{song.year}</span>}
          label={<span className="player-song-label">{song.label}</span>}
        />
      </div>
    );
  },
  render: function() {
    var song = this.state.song;

    return song ? (
      <div className="player-song">
        <img className="player-song-icon" alt="icon" src={song.icons.medium} />
        <div className="player-song-info">
          <div className="player-song-title">{song.title}</div>
          <div className="player-song-artist">{song.artist}</div>
          {this.renderSongDetails(song)}
        </div>
      </div>
    ) : (
      <div className="player-song">Loading...</div>
    );
  }
});
