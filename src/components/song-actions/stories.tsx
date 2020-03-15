import React from "react";
import Bacon from "baconjs";
import { Song, Radio } from "../../types";
import {
  SongActions,
  PlayAction,
  FavoriteAction,
  OpenSpotifyAction,
  PlaySpotifyAction
} from "./index";

export default {
  title: "SongActions"
};

export const Empty = () => <SongActions />;

export const PlaySpotify = () => (
  <SongActions>
    <PlaySpotifyAction playBus={new Bacon.Bus()} song={song} />
  </SongActions>
);

export const PlayRadio = () => (
  <SongActions>
    <PlayAction playBus={new Bacon.Bus()} radio={radio} isPlaying={false} />
  </SongActions>
);

export const StopRadio = () => (
  <SongActions>
    <PlayAction playBus={new Bacon.Bus()} radio={radio} isPlaying={true} />
  </SongActions>
);

export const AddToFavorite = () => (
  <SongActions>
    <FavoriteAction favBus={new Bacon.Bus()} song={song} />
  </SongActions>
);

export const AddedToFavorite = () => (
  <SongActions>
    <FavoriteAction
      favBus={new Bacon.Bus()}
      song={{ ...song, favorite: true }}
    />
  </SongActions>
);

export const OpenSpotify = () => (
  <SongActions>
    <OpenSpotifyAction song={song} />
  </SongActions>
);

export const All = () => (
  <SongActions>
    <PlaySpotifyAction playBus={new Bacon.Bus()} song={song} />
    <PlayAction playBus={new Bacon.Bus()} radio={radio} isPlaying={false} />
    <PlayAction playBus={new Bacon.Bus()} radio={radio} isPlaying={true} />
    <FavoriteAction favBus={new Bacon.Bus()} song={song} />
    <FavoriteAction
      favBus={new Bacon.Bus()}
      song={{ ...song, favorite: true }}
    />
    <OpenSpotifyAction song={song} />
  </SongActions>
);

const song: Song = {
  id: "6M4LerfELXhxqwvjBO5Sd7",
  title: "Run, Run Rudolph",
  artist: "Dr. Teeth and The Electric Mayhem",
  album: "The Muppets: A Green and Red Christmas",
  favorite: false,
  spotify: "https://open.spotify.com/track/6M4LerfELXhxqwvjBO5Sd7",
  spotifyId: "6M4LerfELXhxqwvjBO5Sd7",
  icons: {
    medium: "https://i.scdn.co/image/ab67616d0000b273921b2c58982df57300fbb5ee"
  }
};

const radio: Radio = {
  id: "fip-radio",
  audioSource: "https://direct.fipradio.fr/live/fip-midfi.mp3",
  metadataHref: "https://www.fip.fr/livemeta/7",
  picture:
    "https://www.fip.fr/sites/all/modules/fip/fip_direct/images/direct_default_cover_medium.png",
  stationId: 7,
  color: "#e2007a"
};
