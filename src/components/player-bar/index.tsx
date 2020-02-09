import React, { useEffect, useState } from "react";
import PropTypes, { InferProps, Requireable } from "prop-types";
import { Radio, Song, PlayCommand } from "../../types";
import * as SpotifyClient from "../../spotify/client";
const style = require("./style.css");

import PlayerBarView from "./view";
import * as MIDI from "../../midi";

export type PlayerBarNowPlaying =
  | {
      type: "radio";
      song: Song;
      radio: Radio;
    }
  | {
      type: "spotify";
      song: Song;
    };

export const playerBarPropTypes = {
  nowPlaying: (PropTypes.object as any) as Requireable<PlayerBarNowPlaying>,
  playBus: (PropTypes.object as any) as Requireable<
    Bacon.Bus<any, PlayCommand>
  >,
  playing: PropTypes.bool
};

export type PlayerBarPropTypes = InferProps<typeof playerBarPropTypes>;

export const PlayerBar: React.FunctionComponent<PlayerBarPropTypes> = ({
  nowPlaying,
  playBus,
  playing
}) => {
  const [volume, setVolume] = useState(100);
  let Component;

  if (!nowPlaying) {
    Component = null;
  } else if (nowPlaying.type === "radio") {
    Component = RadioPlayerBar;
  } else if (nowPlaying.type === "spotify") {
    Component = SpotifyPlayerBar;
  }

  useEffect(() => {
    return MIDI.getVolumeEvents().onValue(midiVolume =>
      setVolume(Math.round((midiVolume / 127) * 100))
    );
  }, []);

  return (
    Component && (
      <Component
        nowPlaying={nowPlaying}
        playBus={playBus}
        playing={playing}
        volume={volume}
        onVolumeChange={setVolume}
      />
    )
  );
};

PlayerBar.propTypes = playerBarPropTypes;
export default PlayerBar;

export const playerBarInstancePropTypes = {
  ...playerBarPropTypes,
  nowPlaying: playerBarPropTypes.nowPlaying.isRequired,
  volume: PropTypes.number,
  onVolumeChange: PropTypes.func as Requireable<(volume: number) => void>
};

export type PlayerBarInstancePropTypes = InferProps<
  typeof playerBarInstancePropTypes
>;

export const SpotifyPlayerBar: React.FunctionComponent<PlayerBarInstancePropTypes> = ({
  nowPlaying,
  volume,
  onVolumeChange
}) => {
  const [spotifyState, setSpotifyState] = useState<any>(undefined);
  const playing = spotifyState && !spotifyState.paused;

  useEffect(() => {
    const player = SpotifyClient.getPlayer();

    if (!player) {
      return;
    }

    player.addListener("player_state_changed", setSpotifyState);

    if (nowPlaying.song.spotifyId) {
      SpotifyClient.play(nowPlaying.song.spotifyId);
    }

    return () => {
      player.removeListener("player_state_changed", setSpotifyState);
      player.pause();
    };
  }, [nowPlaying.song.spotifyId]);

  useEffect(() => {
    const player = SpotifyClient.getPlayer();

    if (!player) {
      return;
    }

    const intervalId = setInterval(() => {
      player.getVolume().then((volumeRatio: number) => {
        onVolumeChange && onVolumeChange(Math.round(volumeRatio * 100));
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof volume === "number") {
      setVolume(volume);
    }
  }, [volume]);

  useMediaSessionActionHandler(
    action => {
      const player = SpotifyClient.getPlayer();
      if (player && action === "play") {
        player.resume();
      } else if (player && action === "pause") {
        player.pause();
      }
    },
    [playing]
  );

  function onPlayButtonClick() {
    const player = SpotifyClient.getPlayer();
    player && player.togglePlay();
  }

  function setVolume(volume: number) {
    const player = SpotifyClient.getPlayer();
    onVolumeChange && onVolumeChange(volume);
    player && player.setVolume(volume / 100);
  }

  return (
    <PlayerBarView
      song={nowPlaying.song}
      playing={playing}
      onPlayButtonClick={onPlayButtonClick}
      volume={volume}
      onVolumeChange={setVolume}
    />
  );
};

SpotifyPlayerBar.propTypes = playerBarInstancePropTypes;

export const RadioPlayerBar: React.FunctionComponent<PlayerBarInstancePropTypes> = ({
  nowPlaying,
  playing,
  volume,
  onVolumeChange,
  playBus
}) => {
  const onPlayButtonClick = () => {
    if (playBus) {
      playBus.push(
        playing || nowPlaying.type !== "radio"
          ? { type: "stop" }
          : { type: "radio", radio: nowPlaying.radio.id }
      );
    }
  };

  useMediaSessionActionHandler(
    action => {
      if (playBus && nowPlaying.type === "radio" && action === "play") {
        playBus.push({ type: "radio", radio: nowPlaying.radio.id });
      } else if (playBus && action === "pause") {
        playBus.push({ type: "stop" });
      }
    },
    [playBus, playing]
  );

  return (
    <PlayerBarView
      song={nowPlaying.song}
      playing={playing}
      onPlayButtonClick={onPlayButtonClick}
      volume={volume}
      onVolumeChange={onVolumeChange}
    >
      {playing && nowPlaying.type === "radio" && (
        <Audio
          src={nowPlaying.radio.audioSource}
          volume={typeof volume === "number" ? volume : 100}
        />
      )}
    </PlayerBarView>
  );
};

RadioPlayerBar.propTypes = playerBarInstancePropTypes;

export const audioPropTypes = {
  src: PropTypes.string.isRequired,
  volume: PropTypes.number.isRequired
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

const useMediaSessionActionHandler = (
  handler: (action: MediaSessionAction) => void,
  effectGuards?: Array<any> | undefined
) => {
  useEffect(() => {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler("play", () => handler("play"));
      navigator.mediaSession.setActionHandler("pause", () => handler("pause"));
    }

    return () => {
      if (navigator.mediaSession) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      }
    };
  }, effectGuards);
};
