import React from "react";
import PageRadio from "./index";
import { Song, Radio } from "../../types";

const songOne: Song = {
  artist: "Charles Mingus",
  id: "1aUXs9Li08MdG5Ldvr3n5R",
  spotify: "spotify:track:1aUXs9Li08MdG5Ldvr3n5R",
  icons: {
    medium: "https://i.scdn.co/image/ab67616d0000b273f0a82b946cba1410f3eacee2",
    small: "https://i.scdn.co/image/ab67616d00001e02f0a82b946cba1410f3eacee2"
  },
  album: "Mingus Ah Um",
  year: "1959",
  title: "Better Git It In Your Soul"
};

const songTwo: Song = {
  artist: "Charles Mingus",
  icons: {
    medium: "https://i.scdn.co/image/ab67616d0000b273f0a82b946cba1410f3eacee2",
    small: "https://i.scdn.co/image/ab67616d00001e02f0a82b946cba1410f3eacee2"
  },
  album: "Mingus Ah Um",
  year: "1959",
  id: "3CcQJZFojeqPwQEzhmHt6G",
  title: "Goodbye Pork Pie Hat",
  spotify: "spotify:track:3CcQJZFojeqPwQEzhmHt6G",
  favorite: true
};

const radioOne: Radio = {
  id: "fip-radio",
  stationId: 0,
  metadataHref: "metadata1",
  audioSource: "audioSource1",
  picture: "picture1",
  color: "#ff9999"
};

const radioTwo: Radio = {
  id: "fip-autour-du-jazz",
  stationId: 0,
  metadataHref: "metadata2",
  audioSource: "audioSource2",
  picture: "picture2",
  color: "#99ff99"
};

export default {
  title: "PageRadio"
};

export const Empty = () => (
  <PageRadio
    pastSongs={[]}
    nowPlaying={{ type: "loading" }}
    radios={[]}
    radio="fip-radio"
  />
);

export const NotPlaying = () => (
  <PageRadio
    pastSongs={[]}
    nowPlaying={{ type: "song", song: songOne }}
    radios={[radioOne, radioTwo]}
    radio="fip-autour-du-jazz"
  />
);

export const PlayingWithHistory = () => (
  <PageRadio
    pastSongs={[songOne]}
    nowPlaying={{ type: "song", song: songTwo }}
    radios={[radioOne, radioTwo]}
    radio="fip-autour-du-jazz"
    src="audioSource2"
  />
);
