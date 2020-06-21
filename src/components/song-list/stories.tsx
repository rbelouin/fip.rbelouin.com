import React from "react";
import Bacon from "baconjs";
import { SongList } from "./index";
import { Song } from "../../types";

export default {
  title: "SongList",
};

export const Empty = () => (
  <SongList songs={[]} favBus={new Bacon.Bus()} playBus={new Bacon.Bus()} />
);

const song1: Song = {
  id: "4Ce66JznW8QbeyTdSzdGwR",
  title: "Chameleon",
  icons: {},
  favorite: true
};

const song2: Song = {
  id: "5vmFVIJV9XN1l01YsFuKL3",
  title: "Conscious Club",
  artist: "Vulfpeck",
  icons: {},
};

const song3: Song = {
  id: "2zAGtTlxNoCKdhvdYfgCrU",
  title: "Quarter Master",
  album: "GroundUP",
  artist: "Snarky Puppy",
  icons: {
    medium: "https://i.scdn.co/image/ab67616d0000b2731f6a69634529e41a5cd27b44",
  },
};

const song4: Song = {
  id: "5CC9Y9yvLzNl3iVSWg3noK",
  title: "I Adore You",
  album: "Esperanza",
  artist: "Esperanza Spalding",
  year: "2008",
  icons: {
    small: "https://i.scdn.co/image/ab67616d00001e023d0bdc59a47cf5b39a5d68a9",
  },
};

const song5: Song = {
  id: "68j5DYmCikBzcp60Sv6xWO",
  title: "All I Need (with Mahalia & Ty Dolla $ign)",
  artist: "Jacob Collier, Mahalia, Ty Dolla $ign",
  year: "2020",
  label: "Decca (UMO)",
  icons: {
    medium: "https://i.scdn.co/image/ab67616d0000b273dd2d7a7056e203e7a24e0145",
  },
  favorite: true,
  spotify: "spotify:track:68j5DYmCikBzcp60Sv6xWO",
};

export const SimpleList = () => (
  <SongList
    songs={[song1, song2, song3, song4, song5]}
    favBus={new Bacon.Bus()}
    playBus={new Bacon.Bus()}
  />
);
