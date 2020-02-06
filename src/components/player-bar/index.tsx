import React, { useEffect, useReducer, useState } from "react";
import {
  bool,
  func,
  number,
  object,
  string,
  InferProps,
  Requireable,
  Validator
} from "prop-types";
import { Radio, Song, PlayCommand } from "../../types";
const style = require("./style.css");

export type PlayerBarNowPlaying =
  | {
      type: "radio";
      song: Song;
      radio: Radio;
    }
  | {
      type: "spotify";
      songId: string;
    };

export const playerBarPropTypes = {
  nowPlaying: (object as any) as Requireable<PlayerBarNowPlaying>,
  playBus: (object as any) as Requireable<Bacon.Bus<any, PlayCommand>>,
  playing: bool
};

export type PlayerBarPropTypes = InferProps<typeof playerBarPropTypes>;

export const PlayerBar: React.FunctionComponent<PlayerBarPropTypes> = ({
  nowPlaying,
  playBus,
  playing
}) => {
  if (!nowPlaying) {
    return null;
  }

  if (nowPlaying.type === "radio") {
    return (
      <RadioPlayerBar
        radio={nowPlaying.radio}
        song={nowPlaying.song}
        playBus={playBus}
        playing={playing}
      />
    );
  }

  if (nowPlaying.type === "spotify") {
    return <SpotifyPlayerBar songId={nowPlaying.songId} />;
  }

  return null;
};

export const spotifyPlayerBarPropTypes = {
  songId: string.isRequired
};

export type SpotifyPlayerBarPropTypes = InferProps<
  typeof spotifyPlayerBarPropTypes
>;

export const SpotifyPlayerBar: React.FunctionComponent<SpotifyPlayerBarPropTypes> = ({
  songId
}) => {
  const [width, setWidth] = useState(320);
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
  const url = `https://embed.spotify.com/?uri=spotify:track:${songId}`;

  const resize = () => setWidth(window.document.body.clientWidth);

  const debouncedResize = (cache => () => {
    if (cache.timeoutId) {
      window.clearTimeout(cache.timeoutId);
    }

    cache.timeoutId = window.setTimeout(resize, 300);
  })({} as { timeoutId: number | undefined });

  useEffect(() => {
    resize();
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return (
    <div className={style.spotifyPlayerBar}>
      <iframe
        src={url}
        width={width}
        height="80"
        frameBorder={0}
        allowTransparency={true}
      />
    </div>
  );
};

PlayerBar.propTypes = playerBarPropTypes;

export const radioPlayerBarPropTypes = {
  radio: (object.isRequired as any) as Validator<NonNullable<Radio>>,
  song: (object.isRequired as any) as Validator<NonNullable<Song>>,
  playBus: (object as any) as Requireable<Bacon.Bus<any, PlayCommand>>,
  playing: bool
};

export type RadioPlayerBarPropTypes = InferProps<
  typeof radioPlayerBarPropTypes
>;

export const onPlayButtonClick = (props: RadioPlayerBarPropTypes) => () => {
  if (props.playBus) {
    props.playBus.push(
      props.playing
        ? { type: "stop" }
        : { type: "radio", radio: props.radio.id }
    );
  }
};

export const RadioPlayerBar: React.FunctionComponent<RadioPlayerBarPropTypes> = props => {
  const { radio, song, playBus, playing } = props;
  const [volume, setVolume] = useState(100);

  return (
    <div className={style.radioPlayerBar}>
      {playing && <Audio src={radio.audioSource} volume={volume} />}
      <div className={style.song}>
        <img
          className={style.cover}
          src={song.icons.medium}
          alt="Album cover"
        />
        <div className={style.textSection}>
          <div id="player-bar-song-title" className={style.title}>
            {song.title}
          </div>
          <div className={style.artist}>{song.artist}</div>
        </div>
      </div>
      <PlayButton playing={playing} onClick={onPlayButtonClick(props)} />
      <VolumeControls volume={volume} onVolumeChange={setVolume} />
    </div>
  );
};

RadioPlayerBar.propTypes = radioPlayerBarPropTypes;

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
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = makeSourceUncachable(src);
      audioRef.current.play();
    }
  }, [src]);

  return <audio ref={audioRef}></audio>;
};

export default PlayerBar;
