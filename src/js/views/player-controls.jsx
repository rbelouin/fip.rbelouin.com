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
  onInput: function(e) {
    var volume = e.target.value / 100;

    this.props.volBus.push(volume);
  },
  render: function() {
    var favorite = this.props.song ? this.props.song.favorite : false;
    var icon =  this.props.volume == 0 ?  "off" :
                this.props.volume > 0.5 ? "up" :
                                          "down";

    return (
      <div className="player-controls">
        <FavoriteButton
          favorite={favorite}
          onClick={
            _.partial(this.toggleFavorite, this.props.song)
          }
        />
        {
          this.props.song && this.props.song.spotify ?
            <SpotifyButton
              song={this.props.song}
            /> :
            ""
        }
        <div className="player-controls-volume">
          <span className={"player-controls-volume-icon glyphicon glyphicon-volume-" + icon}></span>
          <input type="range" name="volume" onInput={this.onInput} min="0" max="100" defaultValue={this.props.volume * 100} />
        </div>
      </div>
    );
  }
});
