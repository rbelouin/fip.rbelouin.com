import React from "react";
import createReactClass from "create-react-class";
import { array, object } from "prop-types";

import SyncSection from "../../components/sync-section";
import SongList from "./player-song-list.jsx";

export default createReactClass({
  displayName: "Favorites",
  propTypes: {
    favBus: object.isRequired,
    playBus: object.isRequired,
    syncBus: object.isRequired,
    user: object.isRequired,
    favSongs: array.isRequired
  },
  render: function() {
    return (
      <div className="favorites">
        <SyncSection syncBus={this.props.syncBus} user={this.props.user} />
        <SongList
          songs={this.props.favSongs}
          favBus={this.props.favBus}
          playBus={this.props.playBus}
        />
      </div>
    );
  }
});
