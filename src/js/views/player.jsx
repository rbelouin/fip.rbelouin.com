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
        <div className="col-lg-10 col-lg-offset-1 col-md-12">
          <Song song={song} />
          <Controls url={this.props.url} song={song} favBus={this.props.favBus} />
          <SongList songs={history} favBus={this.props.favBus} />
        </div>
      </div>
    );
  }
});
