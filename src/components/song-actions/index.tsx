import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes, { InferProps } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faHeart as faSolidHeart
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { songPropType, Song, radioPropType, Radio } from "../../types";
import { DispatchContext, Dispatcher } from "../../events";
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
  isPlaying: PropTypes.bool.isRequired
};
export type PlayActionPropTypes = InferProps<typeof playActionPropTypes>;

export const PlayAction: React.FunctionComponent<PlayActionPropTypes> = ({
  radio,
  isPlaying
}) => {
  const dispatch = useContext(DispatchContext);
  return (
    <button
      className={`${style.action} ${style.actionPlay}`}
      onClick={() => togglePlay(radio, isPlaying, dispatch)}
    >
      <FontAwesomeIcon
        className={style.icon}
        icon={isPlaying ? faStop : faPlay}
      />
      <FormattedMessage id={isPlaying ? "stop-the-radio" : "play-the-radio"} />
    </button>
  );
};

PlayAction.propTypes = playActionPropTypes;

export const togglePlay = (
  radio: Radio,
  isPlaying: boolean,
  dispatch: Dispatcher
) => {
  dispatch(
    "play",
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
  song: PropTypes.shape(songPropType).isRequired
};

export type FavoriteActionPropTypes = InferProps<
  typeof favoriteActionPropTypes
>;

export const FavoriteAction: React.FunctionComponent<FavoriteActionPropTypes> = ({
  song
}) => {
  const dispatch = useContext(DispatchContext);
  return (
    <button
      onClick={() => toggleFavorite(dispatch, song)}
      type="button"
      className={`${style.action} ${song.favorite ? style.isFavorite : ""}`}
    >
      <FontAwesomeIcon
        className={style.icon}
        icon={song.favorite ? faSolidHeart : faRegularHeart}
      />
      <FormattedMessage
        id={song.favorite ? "remove-from-favorites" : "add-to-favorites"}
      />
    </button>
  );
};

FavoriteAction.propTypes = favoriteActionPropTypes;

export const toggleFavorite = (dispatch: Dispatcher, song: Song) => {
  dispatch("fav", {
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
      <FontAwesomeIcon className={style.icon} icon={faSpotify} />
      <FormattedMessage id="open-in-spotify" />
    </a>
  ) : null;

OpenSpotifyAction.propTypes = openSpotifyActionPropTypes;

export const playSpotifyActionPropTypes = {
  song: PropTypes.shape(songPropType).isRequired
};

export type PlaySpotifyActionPropTypes = InferProps<
  typeof playSpotifyActionPropTypes
>;

export const PlaySpotifyAction: React.FunctionComponent<PlaySpotifyActionPropTypes> = ({
  song
}) => {
  const dispatch = useContext(DispatchContext);
  return song.spotify ? (
    <button
      className={`${style.action} ${style.actionSpotify}`}
      onClick={() => playSpotify(song, dispatch)}
    >
      <FontAwesomeIcon
        className={`${style.icon} ${style.iconSpotify}`}
        icon={faPlay}
      />
      <FormattedMessage id="play-with-spotify" />
    </button>
  ) : null;
};

PlaySpotifyAction.propTypes = playSpotifyActionPropTypes;

export const playSpotify = (song: Song, dispatch: Dispatcher) => {
  dispatch("play", {
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
