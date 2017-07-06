import React from "react";
import createReactClass from "create-react-class";
import {findDOMNode} from "react-dom";
import {IntlMixin} from "react-intl";
import {number, string} from "prop-types";

export default createReactClass({
  displayName: "Audio",
  propTypes: {
    src: string.isRequired,
    type: string.isRequired,
    volume: number.isRequired
  },
  mixins: [IntlMixin],
  componentDidMount: function() {
    const audio = findDOMNode(this);
    audio.volume = this.props.volume;
    audio.play();
  },
  shouldComponentUpdate: function(nextProps) {
    const audio = findDOMNode(this);
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
