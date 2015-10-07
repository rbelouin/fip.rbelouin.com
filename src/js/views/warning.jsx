var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

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
  mixins: [IntlMixin],
  render: function() {
    return (
      <Warning>
        <FormattedMessage
          message={this.getIntlMessage("error-audio")}
          player={
            <a href="http://fipradio.fr/player">
              <FormattedMessage message={
                this.getIntlMessage("official-player")
              } />
            </a>
          }
        />
      </Warning>
    );
  }
});

var NoMPEGWarning = exports.NoMPEGWarning = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <Warning>
        <FormattedMessage
          message={this.getIntlMessage("error-mpeg")}
          player={
            <a href="http://fipradio.fr/player">
              <FormattedMessage message={
                this.getIntlMessage("official-player")
              } />
            </a>
          }
        />
      </Warning>
    );
  }
});
