var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var IntlMixin = require("react-intl").IntlMixin;

var FavoriteButton = require("./favorite-button.jsx");
var SpotifyButton = require("./spotify-button.jsx");

var Controls = module.exports = React.createClass({
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
      <div className="player-controls">
        {favoriteButton}
        {spotifyButton}
      </div>
    );
  }
});
