import React from "react";
import Bacon from "baconjs";
import { FormattedMessage } from "react-intl";
import PropTypes, { InferProps } from "prop-types";
import {
  songPropType,
  Song,
  radioPropType,
  Radio,
  PlayCommand,
  FavCommand
} from "../../types";
const style = require("./style.css");

export const songActionsPropTypes = {
  children: PropTypes.node
};

export type SongActionsPropTypes = InferProps<typeof songActionsPropTypes>;

export const SongActions: React.FunctionComponent<SongActionsPropTypes> = ({
  children
}) => <div className={style.songActions}>{children}</div>;

SongActions.propTypes = songActionsPropTypes;

export const playActionPropTypes = {
  radio: PropTypes.shape(radioPropType).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, PlayCommand>
  >
};
export type PlayActionPropTypes = InferProps<typeof playActionPropTypes>;

export const PlayAction: React.FunctionComponent<PlayActionPropTypes> = ({
  radio,
  isPlaying,
  playBus
}) => (
  <button
    className={`${style.action} ${style.actionPlay}`}
    onClick={() => togglePlay(radio, isPlaying, playBus)}
  >
    <span
      className={`${style.icon} ${isPlaying ? "fa fa-stop" : "fa fa-play"}`}
    />
    <FormattedMessage id={isPlaying ? "stop-the-radio" : "play-the-radio"} />
  </button>
);

PlayAction.propTypes = playActionPropTypes;

export const togglePlay = (
  radio: Radio,
  isPlaying: boolean,
  playBus: Bacon.Bus<any, PlayCommand>
) => {
  playBus.push(
    isPlaying
      ? {
          type: "stop"
        }
      : {
          type: "radio",
          radio: radio.id
        }
  );
};

export const favoriteActionPropTypes = {
  favBus: (PropTypes.object as PropTypes.Requireable<
    Bacon.Bus<any, FavCommand>
  >).isRequired,
  song: PropTypes.shape(songPropType).isRequired
};

export type FavoriteActionPropTypes = InferProps<
  typeof favoriteActionPropTypes
>;

export const FavoriteAction: React.FunctionComponent<FavoriteActionPropTypes> = ({
  favBus,
  song
}) => (
  <button
    onClick={() => toggleFavorite(favBus, song)}
    type="button"
    className={`${style.action} ${song.favorite ? style.isFavorite : ""}`}
  >
    <span className={`${style.icon} fa fa-heart`} />
    <FormattedMessage
      id={song.favorite ? "remove-from-favorites" : "add-to-favorites"}
    />
  </button>
);

FavoriteAction.propTypes = favoriteActionPropTypes;

export const toggleFavorite = (
  favBus: Bacon.Bus<any, FavCommand>,
  song: Song
) => {
  favBus.push({
    type: song.favorite ? "remove" : "add",
    song
  });
};

export const openSpotifyActionPropTypes = {
  song: PropTypes.shape(songPropType).isRequired
};

export type OpenSpotifyActionPropTypes = InferProps<
  typeof openSpotifyActionPropTypes
>;

export const OpenSpotifyAction: React.FunctionComponent<OpenSpotifyActionPropTypes> = ({
  song
}) =>
  song.spotify ? (
    <a
      href={song.spotify}
      target="_blank"
      className={`${style.action} ${style.actionSpotify}`}
      rel="noopener noreferrer"
    >
      <span className={`${style.icon} fa fa-spotify`} />
      <FormattedMessage id="open-in-spotify" />
    </a>
  ) : null;

OpenSpotifyAction.propTypes = openSpotifyActionPropTypes;

export const playSpotifyActionPropTypes = {
  song: PropTypes.shape(songPropType).isRequired,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, PlayCommand>
  >
};

export type PlaySpotifyActionPropTypes = InferProps<
  typeof playSpotifyActionPropTypes
>;

export const PlaySpotifyAction: React.FunctionComponent<PlaySpotifyActionPropTypes> = ({
  song,
  playBus
}) =>
  song.spotify ? (
    <button
      className={`${style.action} ${style.actionSpotify}`}
      onClick={() => playSpotify(song, playBus)}
    >
      <span className={`${style.icon} ${style.iconSpotify} fa fa-play`} />
      <FormattedMessage id="play-with-spotify" />
    </button>
  ) : null;

PlaySpotifyAction.propTypes = playSpotifyActionPropTypes;

export const playSpotify = (
  song: Song,
  playBus: Bacon.Bus<any, PlayCommand>
) => {
  playBus.push({
    type: "spotify",
    song
  });
};

export default Object.assign(SongActions, {
  PlayAction,
  FavoriteAction,
  OpenSpotifyAction,
  PlaySpotifyAction
});
