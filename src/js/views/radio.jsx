import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import { FormattedMessage } from "react-intl";
import { array, object, string } from "prop-types";

import * as MIDI from "../../midi";
import SongActions from "../../components/song-actions";
import SongList from "../../components/song-list";
import Song from "../../components/song";

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
        <Song isLoading={nowPlaying.type === "loading"} song={nowPlaying.song} />
        {songActions}

        <SongList songs={history} favBus={favBus} playBus={playBus} />
      </div>
    );
  }
});
