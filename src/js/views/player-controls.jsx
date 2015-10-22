var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var IntlMixin = require("react-intl").IntlMixin;

var Audio = require("./audio.jsx");
var FavoriteButton = require("./favorite-button.jsx");

var Controls = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      volume: 0.5
    };
  },
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  onInput: function(e) {
    this.setState({
      volume: e.target.value / 100
    });
  },
  render: function() {
    var favorite = this.props.song ? this.props.song.favorite : false;
    var icon =  this.state.volume == 0 ?  "off" :
                this.state.volume > 0.5 ? "up" :
                                          "down";

    return (
      <div className="player-controls">
        <Audio src={this.props.url} type="audio/mpeg" volume={this.state.volume} />
        <FavoriteButton
          favorite={favorite}
          onClick={
            _.partial(this.toggleFavorite, this.props.song)
          }
        />
        <div className="player-controls-volume">
          <span className={"player-controls-volume-icon glyphicon glyphicon-volume-" + icon}></span>
          <input type="range" name="volume" onInput={this.onInput} />
        </div>
      </div>
    );
  }
});
