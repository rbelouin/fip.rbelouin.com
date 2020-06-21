import React, { useState } from "react";
import PropTypes, { InferProps } from "prop-types";
import SongActions from "../../components/song-actions";
import { songPropType, FavCommand, PlayCommand } from "../../types";
const style = require("./style.css");

export const songListItemPropTypes = {
  song: PropTypes.shape(songPropType).isRequired,
  active: PropTypes.bool.isRequired,
  favBus: PropTypes.object.isRequired as PropTypes.Validator<Bacon.Bus<FavCommand, any>>,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<Bacon.Bus<PlayCommand, any>>,
  onClick: PropTypes.func.isRequired,
};

export type SongListItemProps = InferProps<typeof songListItemPropTypes>;

export const SongListItem: React.FunctionComponent<SongListItemProps> = ({
  song,
  active,
  favBus,
  playBus,
  onClick,
}) => {
  const className = [style.songListItem]
    .concat(song.favorite ? [style.songListItemFavorite] : [])
    .join(" ");
  
  const album = song.album && (
    <span className={style.songListItemAlbum}>{song.album}</span>
  )

  const year = song.year && (
    <span className={style.songListItemYear}>{song.year}</span>
  );

  const controlsClassName = [style.songListItemControls]
    .concat(active ? [style.visible] : [])
    .join(" ");

  return (
    <li className={className} onClick={onClick}>
      <div className={style.songListItemTitle}>{song.title}</div>
      <div className={style.songListItemInfo}>
        <span className={style.songListItemArtist}>{song.artist}</span>
        {album}
        {year}
      </div>
      <div className={controlsClassName}>
        <SongActions>
          <SongActions.PlaySpotifyAction
            playBus={playBus}
            song={song}
          />
          <SongActions.FavoriteAction favBus={favBus} song={song} />
        </SongActions>
      </div>
    </li>
  );
};

SongListItem.propTypes = songListItemPropTypes;

export const songListPropTypes = {
  songs: PropTypes.arrayOf(PropTypes.shape(songPropType).isRequired).isRequired,
  favBus: PropTypes.object.isRequired as PropTypes.Validator<Bacon.Bus<FavCommand, any>>,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<Bacon.Bus<PlayCommand, any>>,
}

export type SongListProps = InferProps<typeof songListPropTypes>;

export const SongList: React.FunctionComponent<SongListProps> = ({ songs, favBus, playBus }) => {
  const [selectedSongId, setSelectedSongId] = useState<string | undefined>(undefined);

  return <ul className={style.songList}>
    {songs.map(song => (<SongListItem
      song={song}
      key={song.id}
      active={song.id === selectedSongId}
      onClick={() => setSelectedSongId(song.id === selectedSongId ? undefined : song.id)}
      playBus={playBus}
      favBus={favBus}
    />))}
  </ul>
}

SongList.propTypes = songListPropTypes;

export default SongList;
