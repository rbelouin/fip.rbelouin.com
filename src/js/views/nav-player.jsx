import React from "react";
import ReactIntl from "react-intl";

import Audio from "./audio.jsx";

const IntlMixin = ReactIntl.IntlMixin;

export default React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      playing: false,
      volume: 50
    };
  },
  onInput: function(ev) {
    const volume = parseInt(ev.target.value);
    this.setState({volume});
  },
  onPlay: function(ev) {
    const playing = !this.state.playing;
    this.setState({playing});
  },
  render: function() {
    const src = this.props.src;
    const song = this.props.song;
    const volume = this.state.volume;
    const playing = this.state.playing;

    const icon =  volume === 0  ? "off" :
                  volume < 50   ? "down" :
                                  "up";

    const audio = src && playing ? (
      <Audio type="audio/mpeg" src={src} volume={volume/100}></Audio>
    ) : "";

    return (
      <div className="nav-player">
        <img className="nav-player-icon" src={song.icons.medium} alt="Album icon" />
        <div className="nav-player-title">{song.title}</div>
        <div className="nav-player-artist">{song.artist}</div>

        <div className="nav-player-controls">
          <button className="nav-player-controls-play" onClick={this.onPlay}>
            <span className={"fa fa-" + (playing ? "stop" : "play")}></span>
          </button>
          <div className="nav-player-controls-volume">
            <span className={"nav-player-controls-volume-icon glyphicon glyphicon-volume-" + icon}></span>
            <input className="nav-player-controls-volume-picker" type="range" name="volume" onInput={this.onInput} min="0" max="100" />
          </div>
        </div>

        {audio}
      </div>
    );
  }
});
