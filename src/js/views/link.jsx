import React from "react";
import createReactClass from "create-react-class";
import Bacon from "baconjs";
import { element, string } from "prop-types";

export default createReactClass({
  displayName: "A",
  propTypes: {
    href: string.isRequired,
    children: element.isRequired
  },
  onClick: function(e) {
    e.preventDefault();
    Bacon.history.pushState(null, null, this.props.href);
  },
  render: function() {
    return (
      <a {...this.props} onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});
