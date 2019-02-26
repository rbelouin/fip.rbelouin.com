import React from "react";
import createReactClass from "create-react-class";
import {FormattedMessage} from "react-intl";
import {bool, object, string} from "prop-types";

import Audio from "./audio.jsx";

export default createReactClass({
  displayName: "NavPlayer",
  propTypes: {
    playBus: object.isRequired,
    src: string,
    radio: string.isRequired,
    nowPlaying: object.isRequired,
    onBottom: bool.isRequired
  },
  getInitialState: function() {
    return {
      volume: 50
    };
  },
  onChange: function(ev) {
    const volume = parseInt(ev.target.value);
    this.setState({volume});
  },
  onPlay: function() {
    this.props.playBus.push(this.props.src ? {
      type: "stop"
    } : {
      type: "radio",
      radio: this.props.radio
    });
  },
  onMute: function() {
    const volume = this.state.volume ? 0 : 50;
    this.setState({volume});
  },
  render: function() {
    const src = this.props.src;
    const nowPlaying = this.props.nowPlaying;
    const volume = this.state.volume;

    const icon =  volume === 0 ? "off" :
      volume < 50 ? "down" : "up";

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
          <button className="nav-player-controls-volume-mute" onClick={this.onMute}>
            <span className={"nav-player-controls-volume-icon glyphicon glyphicon-volume-" + icon}></span>
          </button>
          <input className="nav-player-controls-volume-picker" type="range" name="volume" onChange={this.onChange} min="0" max="100" value={this.state.volume} />
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

export const SongDisplay = createReactClass({
  propTypes: {
    song: object.isRequired
  },
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

export const LoadingDisplay = createReactClass({
  render: function() {
    return (
      <div className="nav-player-display nav-player-display-loading">
        <FormattedMessage id="loading" />
      </div>
    );
  }
});

export const UnknownDisplay = createReactClass({
  render: function() {
    return (
      <div className="nav-player-display nav-player-display-unknown">
        <div className="nav-player-icon">
          <span className="fa fa-question"></span>
        </div>
        <div className="nav-player-info">
          <div className="nav-player-title">
            <FormattedMessage id="title-not-available" />
          </div>
          <div className="nav-player-artist">&nbsp;</div>
        </div>
      </div>
    );
  }
});

export const SpotifyDisplay = createReactClass({
  propTypes: {
    songId: string.isRequired
  },
  render: function() {
    const songId = this.props.songId;
    const url = `https://embed.spotify.com/?uri=spotify:track:${songId}`;

    return (
      <div className="nav-player-display nav-player-display-spotify">
        <iframe src={url} width="210" height="80" frameBorder={0} allowTransparency={true}></iframe>
      </div>
    );
  }
});
