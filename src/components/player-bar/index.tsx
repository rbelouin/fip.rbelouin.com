import React, { useEffect, useState } from "react";
import {
  bool,
  func,
  number,
  object,
  string,
  InferProps,
  Requireable
} from "prop-types";
import { NowPlaying, PlayCommand } from "../../types";
const style = require("./style.css");

export const playerBarPropTypes = {
  nowPlaying: (object as any) as Requireable<NowPlaying>,
  playBus: (object as any) as Requireable<Bacon.Bus<any, PlayCommand>>,
  playing: bool
};

export type PlayerBarPropTypes = InferProps<typeof playerBarPropTypes>;

export const onPlayButtonClick = (props: PlayerBarPropTypes) => () => {
  if (props.nowPlaying && props.playBus) {
    props.playBus.push(
      props.playing
        ? { type: "stop" }
        : { type: "play", radio: props.nowPlaying.radio.id }
    );
  }
};

export const PlayerBar: React.FunctionComponent<PlayerBarPropTypes> = props => {
  const { nowPlaying, playBus, playing } = props;
  const [volume, setVolume] = useState(100);

  return !nowPlaying ? null : (
    <div className={style.root}>
      {playing && <Audio src={nowPlaying.radio.audioSource} volume={volume} />}
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
      <PlayButton playing={playing} onClick={onPlayButtonClick(props)} />
      <VolumeControls volume={volume} onVolumeChange={setVolume} />
    </div>
  );
};

PlayerBar.propTypes = playerBarPropTypes;

export const playButtonPropTypes = {
  playing: bool,
  onClick: func as Requireable<(event: React.MouseEvent<HTMLElement>) => void>
};

export type PlayButtonPropTypes = InferProps<typeof playButtonPropTypes>;

export const PlayButton: React.FunctionComponent<PlayButtonPropTypes> = ({
  playing,
  onClick
}) => {
  const icon = playing ? "stop" : "play";
  return (
    <button
      className={`${style.playButton} ${playing ? style.isPlaying : ""}`}
      onClick={onClick || (() => {})}
    >
      <span className={`fa fa-${icon}`} aria-label={icon}></span>
    </button>
  );
};
PlayButton.propTypes = playButtonPropTypes;

export const volumeControlsPropTypes = {
  volume: number.isRequired,
  onVolumeChange: func as Requireable<(value: number) => any>
};

export type VolumeControlsPropTypes = InferProps<
  typeof volumeControlsPropTypes
>;

export const VolumeControls: React.FunctionComponent<VolumeControlsPropTypes> = ({
  volume,
  onVolumeChange
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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onVolumeChange && onVolumeChange(parseInt(event.target.value))
        }
      />
    </div>
  );
};

VolumeControls.propTypes = volumeControlsPropTypes;

export const audioPropTypes = {
  src: string.isRequired,
  volume: number.isRequired
};

export type AudioPropTypes = InferProps<typeof audioPropTypes>;

export const makeSourceUncachable = (src: string): string => {
  const sourceURL = new URL(src);
  // Add a timestamp to the query string to avoid weird cache issues on playback
  sourceURL.searchParams.append("_t", Date.now().toString());
  return sourceURL.toString();
};

export const Audio: React.FunctionComponent<AudioPropTypes> = ({
  src,
  volume
}) => {
  const audioRef = React.createRef<HTMLAudioElement>();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.play();
    }
  }, [volume]);

  return (
    <audio ref={audioRef}>
      <source src={makeSourceUncachable(src)} type="audio/mpeg" />
    </audio>
  );
};

export default PlayerBar;
