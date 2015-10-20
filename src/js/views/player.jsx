var _ = require("lodash");
var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var Song = require("./player-song.jsx");
var SongList = require("./player-song-list.jsx");
var Controls = require("./player-controls.jsx");

var Player = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var song = _.head(this.props.songs);
    var history = _.tail(this.props.songs);

    return (
      <div className="player row">
        <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
          <Song song={song} />
          <Controls url={this.props.url} song={song} favStream={this.props.favStream} favBus={this.props.favBus} />
          <SongList songs={history} favStream={this.props.favStream} favBus={this.props.favBus} />
        </div>
      </div>
    );
  }
});
