import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import {IntlMixin, FormattedMessage} from "react-intl";
import {array, object, string} from "prop-types";

import Song from "./player-song.jsx";
import SongList from "./player-song-list.jsx";

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
  mixins: [IntlMixin],
  onPlay: function() {
    var src = this.props.src;
    var radios = this.props.radios;
    var radio = _.find(radios, r => r.name === this.props.radio, this);
    var isPlaying = radio && radio.src === src;

    this.props.playBus.push(isPlaying ? {
      type: "stop"
    } : {
      type: "radio",
      radio: radio.name
    });
  },
  onFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var history = this.props.pastSongs;
    var nowPlaying = this.props.nowPlaying;
    var src = this.props.src;
    var favBus = this.props.favBus;
    var playBus = this.props.playBus;
    var radios = this.props.radios;
    var radio = _.find(radios, r => r.name === this.props.radio, this);
    var isPlaying = radio && radio.src === src;

    var nowPlayingDisplay = nowPlaying.type === "song" ?
      <Song song={nowPlaying.song} /> :
      nowPlaying.type === "loading" ?
        <Song.loading /> :
        <Song.unknown />;

    var play = (
      <div className="fipradio-controls-play" onClick={this.onPlay}>
        <span className={isPlaying ? "fa fa-stop" : "fa fa-play"}></span>
        <FormattedMessage
          id={isPlaying ? "stop-the-radio" : "play-the-radio"}
        />
      </div>
    );

    var favorite = nowPlaying.type === "song" ? (
      <div className="fipradio-controls-favorite" onClick={_.partial(this.onFavorite, nowPlaying.song)}>
        <span className="fa fa-heart"></span>
        <FormattedMessage
          id={nowPlaying.song.favorite ? "remove-from-favorites" : "add-to-favorites"}
        />
      </div>
    ) : "";

    var spotify = nowPlaying.type === "song" && nowPlaying.song.spotify ? (
      <a target="_blank" href={nowPlaying.song.spotify} className="fipradio-controls-spotify">
        <span className="fa fa-spotify"></span>
        <FormattedMessage
          id="open-in-spotify"
        />
      </a>
    ) : "";

    var controlsDisplay = nowPlaying.type === "song" ? (
      <div className="fipradio-controls">
        {play}
        {favorite}
        {spotify}
      </div>
    ) : "";

    return (
      <div className="fipradio">
        <div>
          <FormattedMessage
            id="now-broadcasting"
          />
        </div>
        {nowPlayingDisplay}
        {controlsDisplay}

        <hr />

        <SongList songs={history} favBus={favBus} playBus={playBus} />
      </div>
    );
  }
});
