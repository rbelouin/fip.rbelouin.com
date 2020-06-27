import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes, { InferProps } from "prop-types";
const style = require("./style.css");

export const warningPropTypes = {
  children: PropTypes.node
};

export type WarningPropTypes = InferProps<typeof warningPropTypes>;

export const Warning: React.FunctionComponent<WarningPropTypes> = ({
  children
}) => <div className={style.warning}>{children}</div>;
Warning.propTypes = warningPropTypes;

export const NoAudioWarning = () => (
  <Warning>
    <FormattedMessage
      id="error-audio"
      values={{
        player: (
          <a href="http://fipradio.fr/player">
            <FormattedMessage id="official-player" />
          </a>
        )
      }}
    />
  </Warning>
);

export const NoMPEGWarning = () => (
  <Warning>
    <FormattedMessage
      id="error-mpeg"
      values={{
        player: (
          <a href="http://fipradio.fr/player">
            <FormattedMessage id="official-player" />
          </a>
        )
      }}
    />
  </Warning>
);
