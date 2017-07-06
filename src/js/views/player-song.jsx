import React from "react";
import createReactClass from "create-react-class";
import {IntlMixin, FormattedMessage} from "react-intl";
import {object} from "prop-types";

export const SongDetails = createReactClass({
  propTypes: {
    song: object.isRequired
  },
  mixins: [IntlMixin],
  render: function() {
    var song = this.props.song;

    return song.label ? (
      <div className="fipradio-nowplaying-details">
        <FormattedMessage
          id="song-details"
          values={{
            album: <span className="song-album">{song.album}</span>,
            year: <span className="song-year">{song.year}</span>,
            label: <span className="song-label">{song.label}</span>
          }}
        />
      </div>
    ) : (
      <div className="fipradio-nowplaying-details">
        <FormattedMessage
          id="song-details-no-label"
          values={{
            album: <span className="song-album">{song.album}</span>,
            year: <span className="song-year">{song.year}</span>
          }}
        />
      </div>
    );
  }
});

const Song = createReactClass({
  propTypes: {
    song: object.isRequired
  },
  mixins: [IntlMixin],
  render: function() {
    var song = this.props.song;
    var cover = song.icons.medium || song.icons.small;

    return (
      <div className="fipradio-nowplaying">
        <img className="fipradio-nowplaying-cover" alt="cover" src={cover} />
        <div className="fipradio-nowplaying-info">
          <div className="fipradio-nowplaying-title">{song.title}</div>
          <div className="fipradio-nowplaying-artist">{song.artist}</div>
          <SongDetails song={song} />
        </div>
      </div>
    );
  }
});

Song.loading = createReactClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="song">
        <FormattedMessage id="loading" />
      </div>
    );
  }
});

Song.unknown = createReactClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="song song-unknown">
        <div className="song-icon">
          <span className="fa fa-question"></span>
        </div>
        <div className="song-info">
          <div className="song-title">
            <FormattedMessage id="title-not-available" />
          </div>
        </div>
      </div>
    );
  }
});

export default Song;
