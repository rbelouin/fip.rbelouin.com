export type Song = {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  album: string | undefined;
  artist: string;
  year: string | undefined;
  label: string | undefined;
  icons: { [size: string]: string };
};

export type Radio = {
  id: string;
  audioSource: string;
  metadataHref: string;
};

export type NowPlaying = {
  radio: Radio;
  song: Song;
};

export type NowPlayingByRadio = {
  [radioId: string]: NowPlaying;
};
