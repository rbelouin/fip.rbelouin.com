var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var SongListItem = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var song = this.props.song;

    var className = ["song-list-item"]
      .concat(song.favorite ? "song-list-item-favorited" : "")
      .join(" ");

    var year = song.year ? (
      (<span className="song-list-item-year">{song.year}</span>)
    ) : "";

    var favorite = (
      <div className="song-list-item-controls-favorite" onClick={this.props.onFavorite}>
        <span className="fa fa-heart"></span>
        <FormattedMessage
          message={this.getIntlMessage(song.favorite ? "remove-from-favorites" : "add-to-favorites")}
        />
      </div>
    );

    var spotify = song.spotify ? (
      <a target="_blank" href={song.spotify} className="song-list-item-controls-spotify">
        <span className="fa fa-spotify"></span>
        <FormattedMessage
          message={this.getIntlMessage("open-in-spotify")}
        />
      </a>
    ) : "";

    var controlsClassName = ["song-list-item-controls"]
      .concat(this.props.active ? "song-list-item-controls-shown" : "")
      .join(" ");

    return (
      <li className={className} onClick={this.props.onClick}>
        <div className="song-list-item-title">{song.title}</div>
        <div className="song-list-item-info">
          <span className="song-list-item-artist">{song.artist}</span>
          &nbsp;-&nbsp;
          <span className="song-list-item-album">{song.album}</span>
          {year}
        </div>
        <div className={controlsClassName}>
          {favorite}
          {spotify}
        </div>
      </li>
    );
  }
});

var SongList = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      selectedSongId: null
    };
  },
  onFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  onSelect: function(song) {
    var selectedSongId = song.id === this.state.selectedSongId ? null : song.id;

    this.setState({selectedSongId});
  },
  render: function() {
    var songNodes = this.props.songs.map(function(song) {
      return <SongListItem
        song={song}
        key={song.id}
        active={song.id === this.state.selectedSongId}
        onClick={_.partial(this.onSelect, song).bind(this)}
        onFavorite={_.partial(this.onFavorite, song).bind(this)}
      />;
    }, this);

    return _.isEmpty(this.props.songs) ? (
      <ul className="song-list"></ul>
    ) : (
      <ul className="song-list">
        {songNodes}
      </ul>
    );
  }
});
