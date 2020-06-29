import React, { useState } from "react";
import PlayerBar from "./index";
import { PlayCommand } from "../../types";
import { DispatchContext, Dispatcher, Events } from "../../events";

export default {
  title: "PlayerBar"
};

export const Empty = () => <PlayerBar />;
export const WithRadioSong = () => (
  <PlayerBar nowPlaying={{ type: "radio", song, radio }} />
);
export const WithPlayingRadioSong = () => (
  <PlayerBar nowPlaying={{ type: "radio", song, radio }} playing={true} />
);
export const WithPlayableSong = () => {
  const [playing, setPlaying] = useState(false);
  const dispatch: Dispatcher = (name, data) => {
    if (name === "play") {
      setPlaying(((data as Events["play"]).type === "radio");
    }
  };

  return (
    <DispatchContext.Provider value={dispatch}>
      <PlayerBar
        nowPlaying={{ type: "radio", song, radio }}
        playing={playing}
      />
    </DispatchContext.Provider>
  );
};
export const WithSpotifySong = () => (
  <PlayerBar
    nowPlaying={{
      type: "spotify",
      song: spotifySong
    }}
  />
);

const song = {
  id: "songId",
  startTime: Date.now(),
  endTime: Date.now() + 3 * 60 * 1000,
  title: "Little Steps (Instrumental Version)",
  album: "One Offs, Remixes & b-Sides",
  artist: "Nostalgia 77",
  year: undefined,
  label: "Tru Thoughts",
  icons: {
    medium:
      "https://cdn.radiofrance.fr/s3/cruiser-production/2019/11/eb33ce41-a76b-44a6-8cdc-5e7f1a8016b3/400x400_rf_omm_0000204995_dnc.0058126723.jpg"
  }
};

const spotifySong = {
  id: "7clXG2g9KnftB0HVNBCoFm",
  startTime: Date.now(),
  endTime: Date.now() + 3 * 60 * 1000,
  title: "Sinnerman",
  album: "Autour De Nina",
  artist: "Keziah Jones",
  year: undefined,
  label: undefined,
  spotifyId: "7clXG2g9KnftB0HVNBCoFm",
  icons: {
    medium: "https://i.scdn.co/image/62756b3e2ad90e80cf41122b18af83201dc74302"
  }
};

const radio = {
  id: "fip-radio",
  audioSource: "https://direct.fipradio.fr/live/fip-midfi.mp3",
  metadataHref: "https://www.fip.fr/livemeta/7",
  picture:
    "https://www.fip.fr/sites/all/modules/fip/fip_direct/images/direct_default_cover_medium.png",
  stationId: 7,
  color: "#e2007a"
};
