import React from "react";
import { Song as SongComponent } from "./index";
import { Song } from "../../types";

export default {
  title: "Song",
};

export const Loading = () => <SongComponent isLoading />;

const song: Song = {
  id: "1eQJjcLSsHPdjbmVuEHtTf",
  title: "Rouge",
  artist: "Carole Fredericks, Jean-Jacques Goldman, Michael Jones",
  album: "Fredericks, Goldman, Jones : Rouge",
  year: "1993",
  label: "Columbia",
  icons: {
    medium: "https://i.scdn.co/image/ab67616d0000b27314fe72d19e86a2901a0f7eeb",
    small: "https://i.scdn.co/image/ab67616d00001e0214fe72d19e86a2901a0f7eeb",
  },
  spotify: "spotify:track:1eQJjcLSsHPdjbmVuEHtTf",
  favorite: false,
};

export const SongAndLoading = () => <SongComponent isLoading song={song} />;

export const SampleSong = () => <SongComponent song={song} />;

export const SongWithNoCover = () => (
  <SongComponent song={{ ...song, icons: {} }} />
);

export const Unknown = () => <SongComponent />;
