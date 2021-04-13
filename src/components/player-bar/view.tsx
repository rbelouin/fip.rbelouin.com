import React, { useEffect, useState } from "react";
import PropTypes, { InferProps, Requireable, Validator } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faVolumeOff, faVolumeDown, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { songPropType } from "../../types";
const style = require("./style.css");

export const playerBarViewPropTypes = {
  song: PropTypes.shape(songPropType).isRequired,
  playing: PropTypes.bool,
  onPlayButtonClick: PropTypes.func,
  volume: PropTypes.number,
  onVolumeChange: PropTypes.func as Requireable<(volume: number) => void>,
  children: PropTypes.node
};

export type PlayerBarViewPropTypes = InferProps<typeof playerBarViewPropTypes>;

export const PlayerBarView: React.FunctionComponent<PlayerBarViewPropTypes> = ({
  song,
  playing,
  onPlayButtonClick,
  volume,
  onVolumeChange,
  children
}) => (
  <div className={style.radioPlayerBar}>
    {children}
    <div className={style.song}>
      <img
        className={style.cover}
        src={song.icons.medium || undefined}
        alt="Album cover"
      />
      <div className={style.textSection}>
        <div data-testid="player-bar-song-title" className={style.title}>
          {song.title}
        </div>
        <div className={style.artist}>{song.artist}</div>
      </div>
    </div>
    {typeof playing === "boolean" ? (
      <PlayButton playing={playing} onClick={onPlayButtonClick} />
    ) : null}
    {typeof volume === "number" ? (
      <VolumeControls volume={volume} onVolumeChange={onVolumeChange} />
    ) : null}
  </div>
);

PlayerBarView.propTypes = playerBarViewPropTypes;
export default PlayerBarView;

export const playButtonPropTypes = {
  playing: PropTypes.bool,
  onClick: PropTypes.func as Requireable<
    (event: React.MouseEvent<HTMLElement>) => void
  >
};

export type PlayButtonPropTypes = InferProps<typeof playButtonPropTypes>;

export const PlayButton: React.FunctionComponent<PlayButtonPropTypes> = ({
  playing,
  onClick
}) => {
  const icon = playing ? faStop : faPlay;
  const label = playing ? "stop" : "play";
  return (
    <button
      className={`${style.playButton} ${playing ? style.isPlaying : ""}`}
      onClick={onClick || (() => {})}
      aria-label={label} 
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

PlayButton.propTypes = playButtonPropTypes;

export const volumeControlsPropTypes = {
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func as Requireable<(value: number) => any>
};

export type VolumeControlsPropTypes = InferProps<
  typeof volumeControlsPropTypes
>;

export const VolumeControls: React.FunctionComponent<VolumeControlsPropTypes> = ({
  volume,
  onVolumeChange
}) => {
  const icon = volume === 0 ? faVolumeOff : volume < 50 ? faVolumeDown : faVolumeUp;
  return (
    <div className={style.volumeControls}>
      <FontAwesomeIcon className={style.volumeIcon} icon={icon} aria-hidden />
      <input
        className={style.volumePicker}
        type="range"
        name="volume"
        min="0"
        max="100"
        value={volume}
        aria-label="volume"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onVolumeChange && onVolumeChange(parseInt(event.target.value))
        }
      />
    </div>
  );
};

VolumeControls.propTypes = volumeControlsPropTypes;
