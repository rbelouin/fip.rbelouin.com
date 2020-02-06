export type Song = {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  album: string | undefined;
  artist: string | undefined;
  year: string | undefined;
  label: string | undefined;
  icons: { [size: string]: string };
  spotifyId?: string;
};

export type Radio = {
  id: string;
  audioSource: string;
  metadataHref: string;
  picture: string;
  stationId: number;
};

export type NowPlaying = {
  radio: Radio;
  song: Song;
};

export type NowPlayingByRadio = {
  [radioId: string]: NowPlaying;
};

export type FipClientError = Error & {
  data?: {
    [key: string]: any;
  };
};

export type PlayCommand = { type: "stop" } | { type: "radio"; radio: string };
