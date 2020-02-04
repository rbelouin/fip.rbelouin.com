import React from "react";
import { bool, number, object, InferProps, Requireable } from "prop-types";
import { NowPlaying } from "../../types";
const style = require("./style.css");

export const playerBarPropTypes = {
  nowPlaying: (object as any) as Requireable<NowPlaying>,
  playing: bool
};

export type PlayerBarPropTypes = InferProps<typeof playerBarPropTypes>;

export const PlayerBar: React.FunctionComponent<PlayerBarPropTypes> = ({
  nowPlaying,
  playing
}) => {
  return !nowPlaying ? null : (
    <div className={style.root}>
      <div className={style.song}>
        <img
          className={style.cover}
          src={nowPlaying.song.icons.medium}
          alt="Album cover"
        />
        <div className={style.textSection}>
          <div className={style.title}>{nowPlaying.song.title}</div>
          <div className={style.artist}>{nowPlaying.song.artist}</div>
        </div>
      </div>
      <PlayButton playing={playing} />
      <VolumeControls volume={50} />
    </div>
  );
};

PlayerBar.propTypes = playerBarPropTypes;

export const playButtonPropTypes = {
  playing: bool
};

export type PlayButtonPropTypes = InferProps<typeof playButtonPropTypes>;

export const PlayButton: React.FunctionComponent<PlayButtonPropTypes> = ({
  playing
}) => {
  const icon = playing ? "stop" : "play";
  return (
    <button className={style.playButton}>
      <span className={`fa fa-${icon}`} aria-label={icon}></span>
    </button>
  );
};
PlayButton.propTypes = playButtonPropTypes;

export const volumeControlsPropTypes = {
  volume: number.isRequired
};

export type VolumeControlsPropTypes = InferProps<
  typeof volumeControlsPropTypes
>;

export const VolumeControls: React.FunctionComponent<VolumeControlsPropTypes> = ({
  volume
}) => {
  const icon = volume === 0 ? "off" : volume < 50 ? "down" : "up";
  return (
    <div className={style.volumeControls}>
      <span
        className={`${style.volumeIcon} glyphicon glyphicon-volume-${icon}`}
      />
      <input
        className={style.volumePicker}
        type="range"
        name="volume"
        min="0"
        max="100"
        value={volume}
      />
    </div>
  );
};

VolumeControls.propTypes = volumeControlsPropTypes;

export default PlayerBar;
