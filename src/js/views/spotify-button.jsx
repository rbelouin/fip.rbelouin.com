import React from "react";
import createReactClass from "create-react-class";
import {IntlMixin, FormattedMessage} from "react-intl";
import {object} from "prop-types";

export default createReactClass({
  displayName: "SpotifyButton",
  propTypes: {
    song: object.isRequired
  },
  mixins: [IntlMixin],
  render: function() {
    return (
      <a
        href={this.props.song.spotify}
        target="_blank"
        className="player-controls-spotify"
      >
        <span className="player-controls-spotify-icon fa fa-spotify"></span>
        <FormattedMessage id="open-in-spotify" />
      </a>
    );
  }
});
