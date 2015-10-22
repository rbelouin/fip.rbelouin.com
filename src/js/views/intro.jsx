var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Intro = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="intro">
        <h2 className="intro-baseline">
          <FormattedMessage message={this.getIntlMessage("intro-baseline")} />
        </h2>
        <div>
          <button onClick={this.props.onPlay} className="intro-play glyphicon glyphicon-play"></button>
        </div>
      </div>
    );
  }
});
