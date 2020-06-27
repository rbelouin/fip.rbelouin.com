import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import { array, object, string } from "prop-types";

import PageRadio from "../../components/page-radio";
import PageFavorites from "../../components/page-favorites";

import { AppScaffolding } from "../../components/app-scaffolding";
import { AppSection } from "../../components/app-section";
import PlayerBar, { PlayerBarPropTypes } from "../../components/player-bar";
import Navigation from "../../components/navigation";

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
    radios: array.isRequired,
    email: string,
    github: string
  },
  getInitialState: function() {
    return {
      route: "radio",
      radio: "fip-radio",
      radios: {},
      history: [],
      bsong: { type: "loading" },
      psong: { type: "loading" },
      src: null,
      favSongs: [],
      user: null
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
        <PageFavorites
          favoriteSongs={this.state.favSongs}
          favBus={this.props.favBus}
          syncBus={this.props.syncBus}
          playBus={this.props.playBus}
          user={this.state.user}
        />
      ) : this.state.route === "radio" ? (
        <PageRadio
          nowPlaying={this.state.bsong}
          src={this.state.src}
          pastSongs={this.state.history}
          radio={this.state.radio}
          radios={this.props.radios}
          favBus={this.props.favBus}
          playBus={this.props.playBus}
        />
      ) : (
        ""
      );

    const playerBarProps = getPlayerBarProps(this.props, this.state);
    const playerBar = <PlayerBar {...playerBarProps} />;

    return (
      <AppScaffolding
        email={this.props.email}
        github={this.props.github}
        bottomBar={playerBar}
      >
        <AppSection>
          <Navigation
            radios={this.state.radios}
            route={this.state.route}
            radio={this.state.radio}
            favoriteSongs={this.state.favSongs}
          />
        </AppSection>
        <AppSection>{page}</AppSection>
      </AppScaffolding>
    );
  }
});
