import React from "react";
import Bacon from "baconjs";
import PropTypes, { InferProps } from "prop-types";
import { songPropType, FavCommand, PlayCommand } from "../../types";

import SyncSection from "../sync-section";
import SongList from "../song-list";

export const propTypes = {
  favBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, FavCommand>
  >,
  playBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, PlayCommand>
  >,
  syncBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, boolean>
  >,
  user: PropTypes.shape({
    display_name: PropTypes.string.isRequired
  }),
  favoriteSongs: PropTypes.arrayOf(PropTypes.shape(songPropType).isRequired)
    .isRequired
};

export type PageFavoritesProps = InferProps<typeof propTypes>;

export const PageFavorites: React.FunctionComponent<PageFavoritesProps> = ({
  favBus,
  playBus,
  syncBus,
  user,
  favoriteSongs
}) => (
  <div>
    <SyncSection syncBus={syncBus} user={user} />
    <SongList songs={favoriteSongs} favBus={favBus} playBus={playBus} />
  </div>
);

PageFavorites.propTypes = propTypes;

export default PageFavorites;
