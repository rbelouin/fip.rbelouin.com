var React = require("react");
var Bacon = require("baconjs");

var link = module.exports = React.createClass({
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
