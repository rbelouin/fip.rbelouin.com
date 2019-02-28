import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import {FormattedMessage} from "react-intl";
import {array, bool, func, object} from "prop-types";

export const SongListItem = createReactClass({
  displayName: "SongListItem",
  propTypes: {
    song: object.isRequired,
    active: bool.isRequired,
    onFavorite: func.isRequired,
    onSpotifyPlay: func.isRequired,
    onClick: func.isRequired
  },
  render: function() {
    var song = this.props.song;

    var className = ["song-list-item"]
      .concat(song.favorite ? "song-list-item-favorited" : "")
      .join(" ");

    var year = song.year ? (
      <span className="song-list-item-year">{song.year}</span>
    ) : "";

    var favorite = (
      <div className="song-list-item-controls-favorite" onClick={this.props.onFavorite}>
        <span className="fa fa-heart"></span>
        <FormattedMessage
          id={song.favorite ? "remove-from-favorites" : "add-to-favorites"}
        />
      </div>
    );

    var spotify = song.spotify ? (
      <div className="song-list-item-controls-spotify" onClick={this.props.onSpotifyPlay}>
        <span className="fa fa-play"></span>
        <FormattedMessage
          id="play-with-spotify"
        />
      </div>
    ) : "";

    var controlsClassName = ["song-list-item-controls"]
      .concat(this.props.active ? "song-list-item-controls-shown" : "")
      .join(" ");

    return (
      <li className={className} onClick={this.props.onClick}>
        <div className="song-list-item-title">{song.title}</div>
        <div className="song-list-item-info">
          <span className="song-list-item-artist">{song.artist}</span>
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

export default createReactClass({
  displayName: "SongList",
  propTypes: {
    songs: array.isRequired,
    favBus: object.isRequired,
    playBus: object.isRequired
  },
  getInitialState: function() {
    return {
      selectedSongId: null
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
  onSpotifyPlay: function(song) {
    if(song.spotifyId) {
      this.props.playBus.push({
        type: "spotify",
        song: song
      });
    }
  },
  render: function() {
    var songNodes = this.props.songs.map(function(song) {
      return <SongListItem
        song={song}
        key={song.id}
        active={song.id === this.state.selectedSongId}
        onClick={_.partial(this.onSelect, song).bind(this)}
        onFavorite={_.partial(this.onFavorite, song).bind(this)}
        onSpotifyPlay={_.partial(this.onSpotifyPlay, song).bind(this)}
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
