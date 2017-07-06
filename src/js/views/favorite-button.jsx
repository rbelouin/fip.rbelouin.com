import React from "react";
import createReactClass from "create-react-class";
import {IntlMixin, FormattedMessage} from "react-intl";
import {bool, func} from "prop-types";

export default createReactClass({
  displayName: "FavoriteButton",
  propTypes: {
    favorite: bool.isRequired,
    onClick: func.isRequired
  },
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
        <FormattedMessage id={(favorite ? "added" : "add") + "-to-favorites"} />
      </button>
    );
  }
});
