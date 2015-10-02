var React = require("react");

var Player = module.exports = React.createClass({
  render: function() {
    return (
      <div className="player">
        <audio src={this.props.url} autoPlay controls />
      </div>
    );
  }
});
