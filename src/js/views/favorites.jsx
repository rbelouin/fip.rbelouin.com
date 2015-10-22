var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var SongList = require("./player-song-list.jsx");
var Warning = require("./warning.jsx");

var Favorites = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div>
        <div className="alert alert-warning">
          {this.getIntlMessage("favorites-alert")}
        </div>
        <SongList songs={this.props.favSongs} favBus={this.props.favBus} />
      </div>
   );
  }
});
