import React from "react";
import PropTypes, { InferProps } from "prop-types";
import { songPropType } from "../../types";

import SyncSection from "../sync-section";
import SongList from "../song-list";

export const propTypes = {
  user: PropTypes.shape({
    display_name: PropTypes.string.isRequired
  }),
  favoriteSongs: PropTypes.arrayOf(PropTypes.shape(songPropType).isRequired)
    .isRequired
};

export type PageFavoritesProps = InferProps<typeof propTypes>;

export const PageFavorites: React.FunctionComponent<PageFavoritesProps> = ({
  user,
  favoriteSongs
}) => (
  <div>
    <SyncSection user={user} />
    <SongList songs={favoriteSongs} />
  </div>
);

PageFavorites.propTypes = propTypes;

export default PageFavorites;
