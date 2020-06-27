import React, { useEffect } from "react";
import Bacon from "baconjs";
import createReactClass from "create-react-class";
import { FormattedMessage } from "react-intl";
import PropTypes, { InferProps } from "prop-types";
const style = require("./style.css");

import {
  songPropType,
  radioPropType,
  FavCommand,
  PlayCommand,
  Song
} from "../../types";

import * as MIDI from "../../midi";
import SongActions from "../../components/song-actions";
import SongList from "../../components/song-list";
import { default as SongComponent } from "../../components/song";

export const propTypes = {
  src: PropTypes.string,
  radios: PropTypes.arrayOf(PropTypes.shape(radioPropType).isRequired)
    .isRequired,
  radio: PropTypes.string.isRequired,
  favBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, FavCommand>
  >,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, PlayCommand>
  >,
  pastSongs: PropTypes.arrayOf(PropTypes.shape(songPropType).isRequired)
    .isRequired,
  nowPlaying: PropTypes.oneOfType([
    PropTypes.shape({ type: PropTypes.oneOf(["loading"] as const).isRequired }),
    PropTypes.shape({
      type: PropTypes.oneOf(["song", "spotify"] as const).isRequired,
      song: PropTypes.shape(songPropType).isRequired
    }).isRequired
  ]).isRequired as PropTypes.Validator<NowPlaying>
};

export type PageRadioProps = InferProps<typeof propTypes>;
export type NowPlaying =
  | {
      type: "loading";
      song?: undefined;
    }
  | {
      type: "song";
      song: Song;
    }
  | {
      type: "spotify";
      song: Song;
    };

export const PageRadio: React.FunctionComponent<PageRadioProps> = ({
  pastSongs,
  nowPlaying,
  src,
  favBus,
  playBus,
  radios,
  radio
}) => {
  const selectedRadio = radios.find(r => r.id === radio);
  const isPlaying = selectedRadio ? selectedRadio.audioSource === src : false;

  useEffect(() => {
    const unsubscribeMIDI = MIDI.getNoteOffEvents()
      .map(pitch => (pitch - 60) % 12)
      .map(pitch => (pitch < 0 ? pitch + 12 : pitch))
      .map(radioIndex => radios[radioIndex])
      .filter(givenRadio => givenRadio && givenRadio.id === radio)
      .onValue(givenRadio =>
        playBus.push({ type: "radio", radio: givenRadio.id })
      );

    return unsubscribeMIDI;
  }, [playBus, radios, radio]);

  const songActions =
    nowPlaying.type === "song" && selectedRadio ? (
      <div className={style.songActionsContainer}>
        <SongActions>
          <SongActions.PlayAction
            radio={selectedRadio}
            isPlaying={isPlaying}
            playBus={playBus}
          />
          <SongActions.FavoriteAction song={nowPlaying.song} favBus={favBus} />
          <SongActions.OpenSpotifyAction song={nowPlaying.song} />
        </SongActions>
      </div>
    ) : null;

  return (
    <div>
      <div className={style.nowBroadcasting}>
        <FormattedMessage id="now-broadcasting" />
      </div>
      <SongComponent
        isLoading={nowPlaying.type === "loading"}
        song={nowPlaying.song}
      />
      {songActions}

      <SongList songs={pastSongs} favBus={favBus} playBus={playBus} />
    </div>
  );
};

PageRadio.propTypes = propTypes;

export default PageRadio;
