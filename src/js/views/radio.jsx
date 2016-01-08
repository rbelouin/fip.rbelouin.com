var _ = require("lodash");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Song = require("./player-song.jsx");
var SongList = require("./player-song-list.jsx");
var Controls = require("./player-controls.jsx");

var Radio = module.exports = React.createClass({
  mixins: [IntlMixin],
  onPlay: function() {
    this.props.playBus.push(this.props.isPlaying ? {
      type: "stop"
    } : {
      type: "radio",
      radio: this.props.radio
    });
  },
  onFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var history = this.props.pastSongs;
    var nowPlaying = this.props.nowPlaying;
    var isPlaying = this.props.isPlaying;
    var favBus = this.props.favBus;
    var playBus = this.props.playBus;

    var nowPlayingDisplay = nowPlaying.type === "song" ?
                              <Song song={nowPlaying.song} /> :
                            nowPlaying.type === "loading" ?
                              <Song.loading /> :
                              <Song.unknown />;

    var play = (
      <div className="fipradio-controls-play" onClick={this.onPlay}>
        <span className={isPlaying ? "fa fa-stop" : "fa fa-play"}></span>
        <FormattedMessage
          message={this.getIntlMessage(isPlaying ? "stop-the-radio" : "play-the-radio")}
        />
      </div>
    );

    var favorite = nowPlaying.type === "song" ? (
      <div className="fipradio-controls-favorite" onClick={_.partial(this.onFavorite, nowPlaying.song)}>
        <span className="fa fa-heart"></span>
        <FormattedMessage
          message={this.getIntlMessage(nowPlaying.song.favorite ? "remove-from-favorites" : "add-to-favorites")}
        />
      </div>
    ) : "";

    var spotify = nowPlaying.type === "song" && nowPlaying.song.spotify ? (
      <a target="_blank" href={nowPlaying.song.spotify} className="fipradio-controls-spotify">
        <span className="fa fa-spotify"></span>
        <FormattedMessage
          message={this.getIntlMessage("open-in-spotify")}
        />
      </a>
    ) : "";

    var controlsDisplay = nowPlaying.type === "song" ? (
      <div className="fipradio-controls">
        {play}
        {favorite}
        {spotify}
      </div>
    ) : "";

    return (
      <div className="fipradio">
        <div>
          <FormattedMessage
            message={this.getIntlMessage("now-broadcasting")}
          />
        </div>
        {nowPlayingDisplay}
        {controlsDisplay}

        <hr />

        <SongList songs={history} favBus={favBus} playBus={playBus} />
      </div>
    );
  }
});
