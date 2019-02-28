import React from "react";
import createReactClass from "create-react-class";
import {FormattedMessage} from "react-intl";
import {array, object} from "prop-types";

import SongList from "./player-song-list.jsx";

export default createReactClass({
  displayName: "Favorites",
  propTypes: {
    favBus: object.isRequired,
    playBus: object.isRequired,
    syncBus: object.isRequired,
    user: object.isRequired,
    favSongs: array.isRequired,
  },
  onClick: function() {
    this.props.syncBus.push(this.props.user === null);
  },
  render: function() {
    return (
      <div className="favorites">
        <div className="alert alert-info">
          <p>
            <FormattedMessage id="favorites-alert" />
          </p>

          <div className="sync-controls">
            {
              this.props.user ?
                <FormattedMessage
                  id="connected-as"
                  values={{
                    name: this.props.user.display_name
                  }}
                />
                : ""
            }
            <button type="button" className={(this.props.user ? "" : "sync ") + "btn"}  onClick={this.onClick}>
              <span className="fa fa-spotify"></span>
              {this.props.user ? "Unsync" : "Sync"}
            </button>
          </div>
        </div>
        <SongList songs={this.props.favSongs} favBus={this.props.favBus} playBus={this.props.playBus} />
      </div>
    );
  }
});
