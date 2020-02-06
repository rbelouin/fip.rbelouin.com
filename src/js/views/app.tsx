import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import { array, object, string } from "prop-types";

import Radio from "./radio";
import Favorites from "./favorites";

import App from "../../components/app";
import PlayerBar, { PlayerBarPropTypes } from "../../components/player-bar";
import AppNav from "./app-nav";

export const getPlayerBarProps = (
  props: any,
  state: any
): PlayerBarPropTypes => {
  const nowPlaying: PlayerBarPropTypes["nowPlaying"] =
    state.psong.type === "song"
      ? {
          type: "radio",
          song: state.psong.song,
          radio: state.psong.radio
        }
      : state.psong.type === "spotify"
      ? {
          type: "spotify",
          song: state.psong.song
        }
      : undefined;

  return {
    nowPlaying,
    playBus: props.playBus,
    playing: state.src !== null
  };
};

export default createReactClass({
  displayName: "App",
  propTypes: {
    state: object.isRequired,
    favBus: object.isRequired,
    syncBus: object.isRequired,
    playBus: object.isRequired,
    autoplayBus: object.isRequired,
    radios: array.isRequired,
    email: string,
    github: string
  },
  getInitialState: function() {
    return {
      paneIsOpen: false,
      route: "radio",
      radio: "fip-radio",
      history: [],
      bsong: { type: "loading" },
      psong: { type: "loading" },
      src: null,
      favSongs: [],
      user: null,
      autoplayRadio: null
    };
  },
  componentDidMount: function() {
    _.each(
      this.props.state,
      function(stream, name) {
        stream.onValue(
          function(value) {
            const state = {};
            state[name] = value;

            this.setState(state);
          }.bind(this)
        );
      }.bind(this)
    );
  },
  render: function() {
    var page =
      this.state.route === "favorites" ? (
        <Favorites
          favSongs={this.state.favSongs}
          favBus={this.props.favBus}
          syncBus={this.props.syncBus}
          playBus={this.props.playBus}
          user={this.state.user}
        />
      ) : this.state.route === "radio" ? (
        <Radio
          nowPlaying={this.state.bsong}
          src={this.state.src}
          pastSongs={this.state.history}
          radio={this.state.radio}
          radios={this.props.radios}
          autoplayRadio={this.state.autoplayRadio}
          favBus={this.props.favBus}
          playBus={this.props.playBus}
          autoplayBus={this.props.autoplayBus}
        />
      ) : (
        ""
      );

    const playerBarProps = getPlayerBarProps(this.props, this.state);
    const playerBar = <PlayerBar {...playerBarProps} />;

    return (
      <App
        email={this.props.email}
        github={this.props.github}
        bottomBar={playerBar}
      >
        <div className="app">
          <AppNav
            radios={this.props.radios}
            playBus={this.props.playBus}
            src={this.state.src}
            nowPlaying={this.state.psong}
            route={this.state.route}
            radio={this.state.radio}
            paneIsOpen={this.state.paneIsOpen}
          />
          <main className="app-main container-fluid">{page}</main>
        </div>
      </App>
    );
  }
});
