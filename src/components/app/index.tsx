import React, { useEffect, useReducer } from "react";
import Bacon from "baconjs";
import PropTypes, { InferProps } from "prop-types";

import {
  Song,
  Radio,
  FavCommand,
  PlayCommand,
  radioPropType
} from "../../types";
import PageRadio, { NowPlaying } from "../../components/page-radio";
import PageFavorites from "../../components/page-favorites";

import { AppScaffolding } from "../../components/app-scaffolding";
import { AppSection } from "../../components/app-section";
import PlayerBar, { PlayerBarPropTypes } from "../../components/player-bar";
import Navigation, { RadiosState } from "../../components/navigation";

export type State = {
  route: "radio" | "favorites";
  radio: string;
  radios: RadiosState;
  history: Song[];
  bsong: NowPlaying;
  psong: NowPlaying;
  src: string | null;
  favSongs: Song[];
  user: { display_name: string } | null;
};

export type StateStreams = {
  [K in keyof State]: Bacon.Observable<any, State[K]>;
};

export const initialState: State = {
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

export const propTypes = {
  stateStreams: PropTypes.object.isRequired as PropTypes.Validator<
    StateStreams
  >,
  favBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, FavCommand>
  >,
  syncBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, boolean>
  >,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, PlayCommand>
  >,
  radios: PropTypes.arrayOf(PropTypes.shape(radioPropType).isRequired)
    .isRequired,
  email: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired
};

export type AppProps = InferProps<typeof propTypes>;

export const getPlayerBarProps = (
  playBus: Bacon.Bus<any, PlayCommand>,
  psong: NowPlaying,
  src: string | null
): PlayerBarPropTypes => {
  const nowPlaying: PlayerBarPropTypes["nowPlaying"] =
    psong.type === "song"
      ? {
          type: "radio",
          song: psong.song,
          // TODO: consolidate NowPlaying
          // @ts-ignore
          radio: psong.radio
        }
      : psong.type === "spotify"
      ? {
          type: "spotify",
          song: psong.song
        }
      : undefined;

  return {
    nowPlaying,
    playBus,
    playing: src !== null
  };
};

export const App: React.FunctionComponent<AppProps> = ({
  stateStreams,
  favBus,
  syncBus,
  playBus,
  radios,
  email,
  github
}) => {
  const [state, setState] = useReducer<React.Reducer<State, Partial<State>>>(
    (oldState, partialState) => ({ ...oldState, ...partialState }),
    initialState
  );

  useEffect(() => {
    const unsubscribers = Object.keys(stateStreams).map(stateKey => {
      return stateStreams[stateKey].onValue(value => {
        setState({ [stateKey]: value });
      });
    });
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [stateStreams]);

  const page =
    state.route === "favorites" ? (
      <PageFavorites
        favoriteSongs={state.favSongs}
        favBus={favBus}
        syncBus={syncBus}
        playBus={playBus}
        user={state.user}
      />
    ) : state.route === "radio" ? (
      <PageRadio
        nowPlaying={state.bsong}
        src={state.src}
        pastSongs={state.history}
        radio={state.radio}
        radios={radios}
        favBus={favBus}
        playBus={playBus}
      />
    ) : null;

  const playerBarProps = getPlayerBarProps(playBus, state.psong, state.src);
  const playerBar = <PlayerBar {...playerBarProps} />;

  return (
    <AppScaffolding email={email} github={github} bottomBar={playerBar}>
      <AppSection>
        <Navigation
          radios={state.radios}
          route={state.route}
          radio={state.radio}
          favoriteSongs={state.favSongs}
        />
      </AppSection>
      <AppSection>{page}</AppSection>
    </AppScaffolding>
  );
};

export default App;
