import _ from "lodash";
import React from "react";
import createReactClass from "create-react-class";
import {IntlMixin} from "react-intl";
import {object} from "prop-types";

import FavoriteButton from "./favorite-button.jsx";
import SpotifyButton from "./spotify-button.jsx";

export const Controls = createReactClass({
  displayName: "Controls",
  propTypes: {
    favBus: object.isRequired,
    song: object.isRequired
  },
  mixins: [IntlMixin],
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var favorite = this.props.song ? this.props.song.favorite : false;

    const favoriteButton = this.props.song ? (
      <FavoriteButton
        favorite={favorite}
        onClick={
          _.partial(this.toggleFavorite, this.props.song)
        }
      />
    ) : "";

    const spotifyButton = this.props.song && this.props.song.spotify ? (
      <SpotifyButton
        song={this.props.song}
      />
    ) : "";

    return (
      <div className="fipradio-controls">
        {favoriteButton}
        {spotifyButton}
      </div>
    );
  }
});
