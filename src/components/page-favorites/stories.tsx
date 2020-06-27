import React from "react";
import Bacon from "baconjs";
import PageFavorites from "./index";
import { Song } from "../../types";

const songs: Song[] = [
  {
    artist: "Charles Mingus",
    id: "1aUXs9Li08MdG5Ldvr3n5R",
    spotify: "spotify:track:1aUXs9Li08MdG5Ldvr3n5R",
    icons: {
      medium:
        "https://i.scdn.co/image/ab67616d0000b273f0a82b946cba1410f3eacee2",
      small: "https://i.scdn.co/image/ab67616d00001e02f0a82b946cba1410f3eacee2"
    },
    album: "Mingus Ah Um",
    year: "1959",
    title: "Better Git It In Your Soul",
    favorite: true
  },
  {
    artist: "Charles Mingus",
    icons: {
      medium:
        "https://i.scdn.co/image/ab67616d0000b273f0a82b946cba1410f3eacee2",
      small: "https://i.scdn.co/image/ab67616d00001e02f0a82b946cba1410f3eacee2"
    },
    album: "Mingus Ah Um",
    year: "1959",
    id: "3CcQJZFojeqPwQEzhmHt6G",
    title: "Goodbye Pork Pie Hat",
    spotify: "spotify:track:3CcQJZFojeqPwQEzhmHt6G",
    favorite: true
  }
];

export default {
  title: "PageFavorites"
};

export const Empty = () => (
  <PageFavorites
    favBus={new Bacon.Bus()}
    playBus={new Bacon.Bus()}
    syncBus={new Bacon.Bus()}
    favoriteSongs={[]}
  />
);

export const WithUser = () => (
  <PageFavorites
    favBus={new Bacon.Bus()}
    playBus={new Bacon.Bus()}
    syncBus={new Bacon.Bus()}
    user={{ display_name: "Rodolphe Belouin" }}
    favoriteSongs={[]}
  />
);

export const WithSongs = () => (
  <PageFavorites
    favBus={new Bacon.Bus()}
    playBus={new Bacon.Bus()}
    syncBus={new Bacon.Bus()}
    favoriteSongs={songs}
  />
);

export const WithUserAndSongs = () => (
  <PageFavorites
    favBus={new Bacon.Bus()}
    playBus={new Bacon.Bus()}
    syncBus={new Bacon.Bus()}
    user={{ display_name: "Rodolphe Belouin" }}
    favoriteSongs={songs}
  />
);
