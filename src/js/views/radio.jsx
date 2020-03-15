import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import { FormattedMessage } from "react-intl";
import { array, object, string } from "prop-types";

import Song from "./player-song.jsx";
import SongList from "./player-song-list.jsx";
import * as MIDI from "../../midi";
import SongActions from "../../components/song-actions";

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
  componentDidMount: function() {
   const unsubscribeMIDI = MIDI.getNoteOffEvents()
    .map(pitch => this.props.radios[(pitch - 60) % 12])
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

    var songActions =
      nowPlaying.type === "song" ? (
        <div className="fipradio-song-actions">
          <SongActions>
            <SongActions.PlayAction radio={radio} isPlaying={isPlaying} playBus={playBus} />
            <SongActions.FavoriteAction song={nowPlaying.song} favBus={favBus} />
            <SongActions.OpenSpotifyAction song={nowPlaying.song} />
          </SongActions>
        </div>
      ) : null;

    return (
      <div className="fipradio">
        <div>
          <FormattedMessage id="now-broadcasting" />
        </div>
        {nowPlayingDisplay}
        {songActions}

        <SongList songs={history} favBus={favBus} playBus={playBus} />
      </div>
    );
  }
});
