var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var Song = require("./player-song.jsx");
var SongList = require("./player-song-list.jsx");
var Controls = require("./player-controls.jsx");

var Player = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var history = this.props.pastSongs;
    var nowPlaying = this.props.nowPlaying;
    var favBus = this.props.favBus;

    var nowPlayingDisplay = nowPlaying.type === "song" ?
                              <Song song={nowPlaying.song} /> :
                            nowPlaying.type === "loading" ?
                              <Song.loading /> :
                              <Song.unknown />;

    var controlsDisplay = nowPlaying.type === "song" ?
                            <Controls song={nowPlaying.song} favBus={favBus} /> :
                            "";

    return (
      <div className="player row">
        <div className="col-lg-10 col-lg-offset-1 col-md-12">
          {nowPlayingDisplay}
          {controlsDisplay}
          <SongList songs={history} favBus={favBus} />
        </div>
      </div>
    );
  }
});
