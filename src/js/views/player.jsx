var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var Song = require("./player-song.jsx");
var SongList = require("./player-song-list.jsx");
var Controls = require("./player-controls.jsx");

var Player = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var songs = this.props.songs;
    var song = _.head(songs);
    var history = _.tail(songs);

    var nowPlaying =  _.isEmpty(songs) ?  <Song.loading /> :
                      song == null ?      <Song.unknown /> :
                                          <Song song={song} />;

    return (
      <div className="player row">
        <div className="col-lg-10 col-lg-offset-1 col-md-12">
          {nowPlaying}
          <Controls song={song} favBus={this.props.favBus} volBus={this.props.volBus} volume={this.props.volume} />
          <SongList songs={history} favBus={this.props.favBus} />
        </div>
      </div>
    );
  }
});
