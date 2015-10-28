var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var SongList = require("./player-song-list.jsx");
var Warning = require("./warning.jsx");

var Favorites = module.exports = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    this.props.syncBus.push(this.props.user === null);
  },
  render: function() {
    return (
      <div className="favorites">
        <div className="alert alert-info">
          <p>{this.getIntlMessage("favorites-alert")}</p>
          <div className="sync-controls">
            {
              this.props.user ?
                <FormattedMessage
                  message={this.getIntlMessage("connected-as")}
                  name={this.props.user.display_name}
                />
              : ""
            }
            <button type="button" className={(this.props.user ? "" : "sync ") + "btn"}  onClick={this.onClick}>
              <span className="fa fa-spotify"></span>
              {this.props.user ? "Unsync" : "Sync"}
            </button>
          </div>
        </div>
        <SongList songs={this.props.favSongs} favBus={this.props.favBus} />
      </div>
   );
  }
});
