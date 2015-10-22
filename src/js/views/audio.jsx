var _ = require("lodash");
var React = require("react");
var Bacon = require("baconjs");

var IntlMixin = require("react-intl").IntlMixin;

var NoAudioWarning = require("./warning.jsx").NoAudioWarning;
var NoMPEGWarning = require("./warning.jsx").NoMPEGWarning;

var AudioComponent = module.exports = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    var controls = React.findDOMNode(this);
    var audio = controls.querySelector("audio");

    audio.volume = this.props.volume;
    audio.play();
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    var controls = React.findDOMNode(this);
    var audio = controls.querySelector("audio");

    audio.volume = nextProps.volume;

    return true;
  },
  render: function() {
    var src = this.props.src;
    var type = this.props.type;
    var audioDefined = typeof Audio == "function";
    var mpegCompliant = audioDefined && new Audio().canPlayType(type);

    return (
      <div>
        {
          !audioDefined ? <NoAudioWarning /> :
          !mpegCompliant ? <NoMPEGWarning /> :
          ""
        }
        <audio>
          <source src={src} type={type} />
        </audio>
      </div>
    );
  }
});
