import React from "react";
import ReactIntl from "react-intl";

import Audio from "./audio.jsx";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export default React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      volume: 50
    };
  },
  onInput: function(ev) {
    const volume = parseInt(ev.target.value);
    this.setState({volume});
  },
  onPlay: function(ev) {
    this.props.playBus.push(this.props.src ? {
      type: "stop"
    } : {
      type: "radio",
      radio: this.props.radio
    });
  },
  render: function() {
    const src = this.props.src;
    const nowPlaying = this.props.nowPlaying;
    const volume = this.state.volume;

    const icon =  volume === 0  ? "off" :
                  volume < 50   ? "down" :
                                  "up";

    const audio = src ? (
      <Audio type="audio/mpeg" src={src} volume={volume/100}></Audio>
    ) : "";

    const display = nowPlaying.type === "song" ?
                      <SongDisplay song={nowPlaying.song} /> :
                    nowPlaying.type === "loading" ?
                      <LoadingDisplay /> :
                    nowPlaying.type === "spotify" ?
                      <SpotifyDisplay songId={nowPlaying.song.spotifyId} /> :
                      <UnknownDisplay />;

    const controls = nowPlaying.type != "spotify" ? (
      <div className="nav-player-controls">
        <button className="nav-player-controls-play" onClick={this.onPlay}>
          <span className={"fa fa-" + (src ? "stop" : "play")}></span>
        </button>
        <div className="nav-player-controls-volume">
          <span className={"nav-player-controls-volume-icon glyphicon glyphicon-volume-" + icon}></span>
          <input className="nav-player-controls-volume-picker" type="range" name="volume" onInput={this.onInput} min="0" max="100" />
        </div>
      </div>
    ) : "";

    const className = ["nav-player"]
      .concat(this.props.onBottom ? ["nav-player-bottom"] : [])
      .join(" ");

    return (
      <div className={className}>
        {display}
        {controls}
        {audio}
      </div>
    );
  }
});

export const SongDisplay = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    const song = this.props.song;

    return (
      <div className="nav-player-display">
        <img className="nav-player-icon" src={song.icons.medium} alt="Album icon" />
        <div className="nav-player-info">
          <div className="nav-player-title">{song.title}</div>
          <div className="nav-player-artist">{song.artist}</div>
        </div>
      </div>
    );
  }
});

export const LoadingDisplay = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="nav-player-display nav-player-display-loading">
        <FormattedMessage message={this.getIntlMessage("loading")} />
      </div>
    );
  }
});

export const UnknownDisplay = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="nav-player-display nav-player-display-unknown">
        <div className="nav-player-icon">
          <span className="fa fa-question"></span>
        </div>
        <div className="nav-player-info">
          <div className="nav-player-title">
            <FormattedMessage message={this.getIntlMessage("title-not-available")} />
          </div>
          <div className="nav-player-artist">&nbsp;</div>
        </div>
      </div>
    );
  }
});

export const SpotifyDisplay = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    const songId = this.props.songId;
    const url = `https://embed.spotify.com/?uri=spotify:track:${songId}`;

    return (
      <div className="nav-player-display nav-player-display-spotify">
        <iframe src={url} width="210" height="80" frameborder="0" allowtransparency="true"></iframe>
      </div>
    );
  }
});
