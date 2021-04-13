import React, { ReactChild, useEffect, useRef, useState } from "react";
import PropTypes, { InferProps } from "prop-types";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { songPropType } from "../../types";
const style = require("./style.css");

export const songDetailsPropTypes = {
  song: PropTypes.shape(songPropType).isRequired
};

export type SongDetailsProps = InferProps<typeof songDetailsPropTypes>;

export const SongDetails: React.FunctionComponent<SongDetailsProps> = ({
  song
}) => {
  return song.label ? (
    <div className={style.details}>
      <FormattedMessage
        id="song-details"
        values={{
          album: <span className="song-album">{song.album}</span>,
          year: <span className="song-year">{song.year}</span>,
          label: <span className="song-label">{song.label}</span>
        }}
      />
    </div>
  ) : (
    <div className={style.details}>
      <FormattedMessage
        id="song-details-no-label"
        values={{
          album: <span className="song-album">{song.album}</span>,
          year: <span className="song-year">{song.year}</span>
        }}
      />
    </div>
  );
};

SongDetails.propTypes = songDetailsPropTypes;

export const songCoverPropTypes = {
  song: PropTypes.shape(songPropType),
  isLoading: PropTypes.bool
};

export type SongCoverProps = InferProps<typeof songCoverPropTypes>;

export const SongCover: React.FunctionComponent<SongCoverProps> = ({
  song,
  isLoading
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState<"success" | "error" | "pending">("pending");
  const cover = song?.icons.medium || song?.icons.small;

  useEffect(() => {
    const setSuccess = () => setImgLoaded("success");
    const setError = () => setImgLoaded("error");

    if (imgRef.current) {
      imgRef.current.addEventListener("load", setSuccess);
      imgRef.current.addEventListener("error", setError);
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.removeEventListener("load", setSuccess);
        imgRef.current.removeEventListener("error", setError);
      }
    };
  }, [imgRef, setImgLoaded]);

  if (isLoading) {
    return <div className={`${style.cover} ${style.loading}`}></div>;
  }

  if (cover && imgLoaded !== "error") {
    const className = imgLoaded === "success" ? style.cover : `${style.cover} ${style.loading}`;
    return <img className={className} alt="cover" src={cover} ref={imgRef} />;
  }

  return (
    <div className={`${style.cover} ${style.unknown}`}>
      <FontAwesomeIcon icon={faQuestion} />
    </div>
  );
};

export const propTypes = {
  song: PropTypes.shape(songPropType),
  isLoading: PropTypes.bool
};

export type SongProps = InferProps<typeof propTypes>;

export const Song: React.FunctionComponent<SongProps> = ({
  song,
  isLoading
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
        <div data-testid="song-component-title" className={style.title}>{song.title}</div>
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

Song.propTypes = propTypes;

export default Song;
