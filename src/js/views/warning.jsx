var React = require("react");

var Warning = exports.Warning = React.createClass({
  render: function() {
    return (
      <div className="alert alert-warning">
        {this.props.children}
      </div>
    );
  }
});

var NoAudioWarning = exports.NoAudioWarning = React.createClass({
  render: function() {
    return (
      <Warning>
        Your browser is not compatible with this player because it cannot play music without Adobe Flash installed. Please use another browser, or see <a href="http://fipradio.fr/player">the official FIP player</a>
      </Warning>
    );
  }
});

var NoMPEGWarning = exports.NoMPEGWarning = React.createClass({
  render: function() {
    return (
      <Warning>
        Your browser is not compatible with this player because it cannot play audio/mpeg streams without any plugin. Please use another browser, or see <a href="http://fipradio.fr/player">the official FIP player</a>
      </Warning>
    );
  }
});
