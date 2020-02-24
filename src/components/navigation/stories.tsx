import React from "react";
import Navigation from "./index";
import { Radio, Song } from "../../types";

export default {
  title: "Navigation"
};

export const Empty = () => (
  <Navigation
    route="radio"
    radio="fip-autour-du-jazz"
    radios={{
      one: {
        nowPlaying: {
          type: "loading"
        }
      }
    }}
  />
);

export const Default = () => (
  <Navigation
    route="radio"
    radio="fip-autour-du-jazz"
    radios={{
      one: {
        nowPlaying: {
          type: "song",
          radio: radioOne,
          song: songOne
        }
      },
      two: {
        nowPlaying: {
          type: "song",
          radio: radioTwo,
          song: songOne
        }
      }
    }}
  />
);

export const WithManyItems = () => (
  <Navigation
    route="radio"
    radio="fip-radio"
    radios={{
      one: {
        nowPlaying: {
          type: "song",
          radio: radioOne,
          song: songOne
        }
      },
      two: {
        nowPlaying: {
          type: "song",
          radio: radioTwo,
          song: songOne
        }
      },
      three: {
        nowPlaying: {
          type: "song",
          radio: radioTwo,
          song: songOne
        }
      },
      four: {
        nowPlaying: {
          type: "song",
          radio: radioTwo,
          song: songOne
        }
      },
      five: {
        nowPlaying: {
          type: "song",
          radio: radioTwo,
          song: songOne
        }
      },
      six: {
        nowPlaying: {
          type: "song",
          radio: radioTwo,
          song: songOne
        }
      }
    }}
  />
);

const songOne: Song = {
  id: "",
  startTime: 1582577144,
  endTime: 1582577357,
  title: "Peace Lovin' Man",
  album: "House Of The Blues",
  artist: "John Lee Hooker",
  label: "Chess@",
  year: undefined,
  icons: {
    medium:
      "https://cdn.radiofrance.fr/s3/cruiser-production/2019/12/f874ad9d-7f1a-4b76-94e1-4bb0f4a4cfda/400x400_rf_omm_0000683567_dnc.0053788382.jpg"
  }
};

const radioOne: Radio = {
  id: "fip-radio",
  stationId: 0,
  metadataHref: "metadata",
  audioSource: "audioSource",
  picture: "picture",
  color: "#ff9999"
};

const radioTwo: Radio = {
  id: "fip-autour-du-jazz",
  stationId: 0,
  metadataHref: "metadata",
  audioSource: "audioSource",
  picture: "picture",
  color: "#99ff99"
};
