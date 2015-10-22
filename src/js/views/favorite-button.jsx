var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var IntlMixin = require("react-intl").IntlMixin;

var FavoriteButton = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var favorite = this.props.favorite;
    var className = favorite ? " player-controls-favorite-added" : "";

    return (
      <button
        onClick={this.props.onClick}
        type="button"
        className={"player-controls-favorite" + className}
      >
        <span className="player-controls-favorite-icon glyphicon glyphicon-heart"></span>
        {this.getIntlMessage((favorite ? "added" : "add") + "-to-favorites")}
      </button>
    );
  }
});
