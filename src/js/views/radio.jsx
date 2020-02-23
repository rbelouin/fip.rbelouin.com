import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import { FormattedMessage } from "react-intl";
import { array, object, string } from "prop-types";

import Song from "./player-song.jsx";
import SongList from "./player-song-list.jsx";
import * as MIDI from "../../midi";

export default createReactClass({
  displayName: "Radio",
  propTypes: {
    src: string,
    radios: array.isRequired,
    radio: string.isRequired,
    favBus: object.isRequired,
    playBus: object.isRequired,
    pastSongs: array.isRequired,
    nowPlaying: object.isRequired
  },
  onPlay: function() {
    var src = this.props.src;
    var radios = this.props.radios;
    var radio = _.find(radios, r => r.id === this.props.radio, this);
    var isPlaying = radio && radio.audioSource === src;

    this.props.playBus.push(
      isPlaying
        ? {
            type: "stop"
          }
        : {
            type: "radio",
            radio: radio.id
          }
    );
  },
  onFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  componentDidMount: function() {
   const unsubscribeMIDI = MIDI.getNoteOffEvents()
    .map(pitch => this.props.radios[pitch - 60])
    .filter(radio => radio && radio.id === this.props.radio)
    .onValue(radio => this.props.playBus.push({ type: "radio", radio: radio.id }));

    this.setState({ unsubscribeMIDI });
  },
  componentWillUnmount: function() {
    this.state.unsubscribeMIDI && this.state.unsubscribeMIDI();
  },
  render: function() {
    var history = this.props.pastSongs;
    var nowPlaying = this.props.nowPlaying;
    var src = this.props.src;
    var favBus = this.props.favBus;
    var playBus = this.props.playBus;
    var radios = this.props.radios;
    var radio = _.find(radios, r => r.id === this.props.radio, this);
    var isPlaying = radio && radio.audioSource === src;

    var nowPlayingDisplay =
      nowPlaying.type === "song" ? (
        <Song song={nowPlaying.song} />
      ) : nowPlaying.type === "loading" ? (
        <Song.loading />
      ) : (
        <Song.unknown />
      );

    var play = (
      <div className="fipradio-controls-play" onClick={this.onPlay}>
        <span className={isPlaying ? "fa fa-stop" : "fa fa-play"} />
        <FormattedMessage
          id={isPlaying ? "stop-the-radio" : "play-the-radio"}
        />
      </div>
    );

    var favorite =
      nowPlaying.type === "song" ? (
        <div
          className="fipradio-controls-favorite"
          onClick={_.partial(this.onFavorite, nowPlaying.song)}
        >
          <span className="fa fa-heart" />
          <FormattedMessage
            id={
              nowPlaying.song.favorite
                ? "remove-from-favorites"
                : "add-to-favorites"
            }
          />
        </div>
      ) : (
        ""
      );

    var spotify =
      nowPlaying.type === "song" && nowPlaying.song.spotify ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={nowPlaying.song.spotify}
          className="fipradio-controls-spotify"
        >
          <span className="fa fa-spotify" />
          <FormattedMessage id="open-in-spotify" />
        </a>
      ) : (
        ""
      );

    var controlsDisplay =
      nowPlaying.type === "song" ? (
        <div className="fipradio-controls">
          {play}
          {favorite}
          {spotify}
        </div>
      ) : (
        ""
      );

    return (
      <div className="fipradio">
        <hr />

        <div>
          <FormattedMessage id="now-broadcasting" />
        </div>
        {nowPlayingDisplay}
        {controlsDisplay}

        <hr />

        <SongList songs={history} favBus={favBus} playBus={playBus} />
      </div>
    );
  }
});
