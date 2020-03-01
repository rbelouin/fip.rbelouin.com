import PropTypes, { InferProps } from "prop-types";

export const songPropType = {
  id: PropTypes.string.isRequired,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  title: PropTypes.string.isRequired,
  album: PropTypes.string,
  artist: PropTypes.string,
  year: PropTypes.string,
  label: PropTypes.string,
  icons: PropTypes.shape({
    medium: PropTypes.string,
    small: PropTypes.string
  }).isRequired,
  spotifyId: PropTypes.string
};

export type Song = InferProps<typeof songPropType>;

export const radioPropType = {
  id: PropTypes.string.isRequired,
  audioSource: PropTypes.string.isRequired,
  metadataHref: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  stationId: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

export type Radio = InferProps<typeof radioPropType>;

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
