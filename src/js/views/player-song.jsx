var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var SongDetails = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var song = this.props.song;

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
  }
});

var Song = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var song = this.props.song;

    return (
      <div className="song">
        <img className="song-icon" alt="icon" src={song.icons.medium} />
        <div className="song-info">
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artist}</div>
          <SongDetails song={song} />
        </div>
      </div>
    );
  }
});

Song.loading = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="song">
        <FormattedMessage message={this.getIntlMessage("loading")} />
      </div>
    );
  }
});

Song.unknown = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="song song-unknown">
        <div className="song-icon">
          <span className="fa fa-question"></span>
        </div>
        <div className="song-info">
          <div className="song-title">
            <FormattedMessage message={this.getIntlMessage("title-not-available")} />
          </div>
        </div>
      </div>
    );
  }
});

Song.tr = React.createClass({
  render: function() {
    var song = this.props.song;

    return (
      <tr>
        <td className={song.favorite ? "song-list-favorite" : ""}>
          <span className="fa fa-heart" onClick={this.props.toggleFavorite}></span>
        </td>
        <td className={song.spotify ? "song-list-spotify" : ""}>
          <a href={song.spotify} target="_blank" className="fa fa-spotify"></a>
        </td>
        <td>{song.title}</td>
        <td>{song.artist}</td>
        <td>{song.album}</td>
        <td>{song.year}</td>
        <td>{song.label}</td>
      </tr>
    );
  }
});

Song.li = React.createClass({
  render: function() {
    var song = this.props.song;

    return (
      <li>
        <Song song={song} />
      </li>
    );
  }
});
