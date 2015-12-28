var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var SongListItem = React.createClass({
  render: function() {
    var song = this.props.song;

    var className = ["song-list-item"]
      .concat(song.favorite ? "song-list-item-favorited" : "")
      .join(" ");

    var year = song.year ? (
      (<span className="song-list-item-year">{song.year}</span>)
    ) : "";

    return (
      <li className={className}>
        <div className="song-list-item-title">{song.title}</div>
        <div className="song-list-item-info">
          <span className="song-list-item-artist">{song.artist}</span>
          &nbsp;-&nbsp;
          <span className="song-list-item-album">{song.album}</span>
          {year}
        </div>
      </li>
    );
  }
});

var SongList = module.exports = React.createClass({
  mixins: [IntlMixin],
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var songNodes = this.props.songs.map(function(song) {
      return <SongListItem song={song} key={song.id} />;
    });

    return _.isEmpty(this.props.songs) ? (
      <ul className="song-list"></ul>
    ) : (
      <ul className="song-list">
        {songNodes}
      </ul>
    );
  }
});
