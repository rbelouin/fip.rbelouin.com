import React from "react";
import ReactIntl from "react-intl";

const IntlMixin = ReactIntl.IntlMixin;

export default React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    const audio = React.findDOMNode(this);
    audio.volume = this.props.volume;
    audio.play();
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    const audio = React.findDOMNode(this);
    audio.volume = nextProps.volume;

    if(this.props.src != nextProps.src) {
      audio.src = nextProps.src;
      audio.play();
    }

    return true;
  },
  render: function() {
    const src = this.props.src;
    const type = this.props.type;

    return (
      <audio>
        <source src={src} type={type} />
      </audio>
    );
  }
});
