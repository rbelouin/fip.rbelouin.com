import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import { array, bool, func, object } from "prop-types";
import SongActions from "../../components/song-actions";

export const SongListItem = createReactClass({
  displayName: "SongListItem",
  propTypes: {
    song: object.isRequired,
    active: bool.isRequired,
    favBus: object.isRequired,
    playBus: object.isRequired,
    onClick: func.isRequired
  },
  render: function() {
    var song = this.props.song;

    var className = ["song-list-item"]
      .concat(song.favorite ? "song-list-item-favorited" : "")
      .join(" ");

    var year = song.year ? (
      <span className="song-list-item-year">{song.year}</span>
    ) : (
      ""
    );

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
          <SongActions>
            <SongActions.PlaySpotifyAction playBus={this.props.playBus} song={song} />
            <SongActions.FavoriteAction favBus={this.props.favBus} song={song} />
          </SongActions>
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
  onSelect: function(song) {
    var selectedSongId = song.id === this.state.selectedSongId ? null : song.id;

    this.setState({ selectedSongId });
  },
  render: function() {
    var songNodes = this.props.songs.map(function(song) {
      return (
        <SongListItem
          song={song}
          key={song.id}
          active={song.id === this.state.selectedSongId}
          onClick={_.partial(this.onSelect, song).bind(this)}
          playBus={this.props.playBus}
          favBus={this.props.favBus}
        />
      );
    }, this);

    return _.isEmpty(this.props.songs) ? (
      <ul className="song-list" />
    ) : (
      <ul className="song-list">{songNodes}</ul>
    );
  }
});
