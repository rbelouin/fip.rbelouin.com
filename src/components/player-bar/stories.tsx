import * as React from "react";
import PlayerBar from "./index";

export default {
  title: "PlayerBar"
};

export const Empty = () => <PlayerBar />;
export const WithSong = () => <PlayerBar nowPlaying={{ song, radio }} />;
export const WithPlayingSong = () => (
  <PlayerBar nowPlaying={{ song, radio }} playing={true} />
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

const radio = {
  id: "fip-radio",
  audioSource: "https://direct.fipradio.fr/live/fip-midfi.mp3",
  metadataHref: "https://www.fip.fr/livemeta/7",
  picture:
    "https://www.fip.fr/sites/all/modules/fip/fip_direct/images/direct_default_cover_medium.png",
  stationId: 7
};
