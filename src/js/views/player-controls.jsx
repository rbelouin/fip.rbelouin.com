var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var IntlMixin = require("react-intl").IntlMixin;

var NoAudioWarning = require("./warning.jsx").NoAudioWarning;
var NoMPEGWarning = require("./warning.jsx").NoMPEGWarning;

var Controls = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      song: null
    };
  },
  componentDidMount: function() {
    var controls = React.findDOMNode(this);
    var audio = controls.querySelector("audio");
    var input = controls.querySelector("input");
    var icon = controls.querySelector(".player-controls-volume-icon");

    audio.play();

    var p_song = this.props.p_song.flatMapLatest(function(song) {
      return this.props.favStream
        .filter(function(ev) {
          return ev.song === song.id;
        })
        .map(function(ev) {
          return _.extend({}, song, {
            favorite: ev.type === "added"
          });
        })
        .toProperty(song);
    }.bind(this));

    var p_volume = Bacon.fromEventTarget(input, "input").map(function(e) {
      return e.target.value;
    }).toProperty(input.value);

    var p_icon = p_volume.map(function(volume) {
      return  volume == 0 ? "off" :
              volume > 50 ? "up" :
                            "down";
    }).skipDuplicates();

    p_song.onValue(function(song) {
      this.setState({song: song})
    }.bind(this));

    p_volume.filter(audio != null).onValue(function(volume) {
      audio.volume = volume / 100;
    });

    p_icon.onValue(function(iconName) {
      icon.className = _.map(icon.classList, function(className) {
        var isIconClass = className.indexOf("glyphicon-volume-") == 0;
        return isIconClass ? "glyphicon-volume-" + iconName : className;
      }).join(" ");
    });
  },
  getAudioTag: function() {
    var type = "audio/mpeg";
    var audioDefined = typeof Audio == "function";
    var mpegCompliant = audioDefined && new Audio().canPlayType(type);

    return (
      <div>
        {
          !audioDefined ? <NoAudioWarning /> :
          !mpegCompliant ? <NoMPEGWarning /> :
          ""
        }
        <audio>
          <source src={this.props.url} type={type} />
        </audio>
      </div>
    );
  },
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  getFavoriteTag: function() {
    var song = this.state.song;
    var favorited = song && song.favorite;

    return song ? (
      <button type="button" onClick={_.partial(this.toggleFavorite.bind(this), song)} className={"player-controls-favorite" + (favorited ? " player-controls-favorite-added" : "")}>
        <span className="player-controls-favorite-icon glyphicon glyphicon-heart"></span>
        {this.getIntlMessage((favorited ? "added" : "add") + "-to-favorites")}
      </button>
    ) : (
      ""
    );
  },
  render: function() {
    return (
      <div className="player-controls">
        {this.getAudioTag()}
        {this.getFavoriteTag()}
        <div className="player-controls-volume">
          <span className="player-controls-volume-icon glyphicon glyphicon-volume-up"></span>
          <input type="range" name="volume" />
        </div>
      </div>
    );
  }
});
