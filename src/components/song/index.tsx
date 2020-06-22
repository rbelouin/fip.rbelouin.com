import React, { ReactChild, ReactChildren } from "react";
import PropTypes, { InferProps } from "prop-types";
import { FormattedMessage } from "react-intl";
import { songPropType } from "../../types";
const style = require("./style.css");

export const songDetailsPropTypes = {
  song: PropTypes.shape(songPropType).isRequired,
};

export type SongDetailsProps = InferProps<typeof songDetailsPropTypes>;

export const SongDetails: React.FunctionComponent<SongDetailsProps> = ({
  song,
}) => {
  return song.label ? (
    <div className={style.details}>
      <FormattedMessage
        id="song-details"
        values={{
          album: <span className="song-album">{song.album}</span>,
          year: <span className="song-year">{song.year}</span>,
          label: <span className="song-label">{song.label}</span>,
        }}
      />
    </div>
  ) : (
    <div className={style.details}>
      <FormattedMessage
        id="song-details-no-label"
        values={{
          album: <span className="song-album">{song.album}</span>,
          year: <span className="song-year">{song.year}</span>,
        }}
      />
    </div>
  );
};

SongDetails.propTypes = songDetailsPropTypes;

export const songCoverPropTypes = {
  song: PropTypes.shape(songPropType),
  isLoading: PropTypes.bool,
};

export type SongCoverProps = InferProps<typeof songCoverPropTypes>;

export const SongCover: React.FunctionComponent<SongCoverProps> = ({
  song,
  isLoading,
}) => {
  const cover = song?.icons.medium || song?.icons.small;

  if (isLoading) {
    return <div className={`${style.cover} ${style.loading}`}></div>;
  }

  if (cover) {
    return <img className={style.cover} alt="cover" src={cover} />;
  }

  return (
    <div className={`${style.cover} ${style.unknown}`}>
      <span className="fa fa-question" />
    </div>
  );
};

export const propTypes = {
  song: PropTypes.shape(songPropType),
  isLoading: PropTypes.bool,
};

export type SongProps = InferProps<typeof propTypes>;

export const Song: React.FunctionComponent<SongProps> = ({
  song,
  isLoading,
}) => {
  const wrapper = (content: ReactChild) => (
    <div className={style.song}>
      <SongCover song={song} isLoading={isLoading} />
      {content}
    </div>
  );

  if (isLoading) {
    return wrapper(
      <div className={`${style.title} ${style.loading}`}>
        <FormattedMessage id="loading" />
      </div>
    );
  }

  if (song) {
    return wrapper(
      <>
        <div className={style.title}>{song.title}</div>
        <div className={style.artist}>{song.artist}</div>
        <SongDetails song={song} />
      </>
    );
  }

  return wrapper(
    <div className={`${style.title} ${style.unknown}`}>
      <FormattedMessage id="title-not-available" />
    </div>
  );
};

export default Song;
