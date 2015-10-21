var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Song = module.exports = React.createClass({
  mixins: [IntlMixin],
  renderSongDetails: function(song) {
    return song.label ? (
      <div className="song-details">
        <FormattedMessage
          message={this.getIntlMessage("song-details")}
          album={<span className="song-album">{song.album}</span>}
          year={<span className="song-year">{song.year}</span>}
          label={<span className="song-label">{song.label}</span>}
        />
      </div>
    ) : (
      <div className="song-details">
        <FormattedMessage
          message={this.getIntlMessage("song-details-no-label")}
          album={<span className="song-album">{song.album}</span>}
          year={<span className="song-year">{song.year}</span>}
        />
      </div>
    );
  },
  render: function() {
    var song = this.props.song;

    return song ? (
      <div className="song">
        <img className="song-icon" alt="icon" src={song.icons.medium} />
        <div className="song-info">
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artist}</div>
          {this.renderSongDetails(song)}
        </div>
      </div>
    ) : (
      <div className="song">
        <FormattedMessage message={this.getIntlMessage("loading")} />
      </div>
    );
  }
});
