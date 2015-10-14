var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Intro = module.exports = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    this.refs.play.getDOMNode().addEventListener("click", this.props.onPlay.bind(this));
  },
  render: function() {
    return (
      <div className="intro">
        <h2 className="intro-baseline">
          <FormattedMessage message={this.getIntlMessage("intro-baseline")} />
        </h2>
        <div>
          <button className="intro-play" ref="play">Play</button>
        </div>
      </div>
    );
  }
});
