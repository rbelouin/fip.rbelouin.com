import React from "react";
import createReactClass from "create-react-class";
import {IntlMixin, FormattedMessage} from "react-intl";
import {element} from "prop-types";

export const Warning = createReactClass({
  displayName: "Warning",
  propTypes: {
    children: element
  },
  render: function() {
    return (
      <div className="alert alert-warning">
        {this.props.children}
      </div>
    );
  }
});

export const NoAudioWarning = createReactClass({
  displayName: "NoAudioWarning",
  mixins: [IntlMixin],
  render: function() {
    return (
      <Warning>
        <FormattedMessage
          id="error-audio"
          values={{
            player: <a href="http://fipradio.fr/player">
              <FormattedMessage id="official-player" />
            </a>
          }}
        />
      </Warning>
    );
  }
});

export const NoMPEGWarning = createReactClass({
  displayName: "NoMPEGWarning",
  mixins: [IntlMixin],
  render: function() {
    return (
      <Warning>
        <FormattedMessage
          id="error-mpeg"
          values={{
            player: <a href="http://fipradio.fr/player">
              <FormattedMessage id="official-player" />
            </a>
          }}
        />
      </Warning>
    );
  }
});
