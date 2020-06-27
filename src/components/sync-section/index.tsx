import React from "react";
import Bacon from "baconjs";
import { FormattedMessage } from "react-intl";
import PropTypes, { InferProps } from "prop-types";
const style = require("./style.css");

export const syncSectionPropTypes = {
  syncBus: PropTypes.object.isRequired as PropTypes.Validator<
    Bacon.Bus<any, boolean>
  >,
  user: PropTypes.shape({
    display_name: PropTypes.string.isRequired
  })
};

export type SyncSectionPropTypes = InferProps<typeof syncSectionPropTypes>;

export const SyncSection: React.FunctionComponent<SyncSectionPropTypes> = ({
  syncBus,
  user
}) => (
  <div className={style.syncSection}>
    <p>
      <FormattedMessage id="favorites-alert" />
    </p>

    <div className={style.syncAction}>
      {user ? (
        <FormattedMessage
          id="connected-as"
          values={{
            name: user.display_name.replace(/\s/g, " ")
          }}
        />
      ) : null}
      <button
        type="button"
        className={`${style.button} ${
          user ? style.buttonUnsync : style.buttonSync
        }`}
        onClick={() => toggleSync(syncBus, user || undefined)}
      >
        <span className={`${style.buttonIcon} fa fa-spotify`} />
        {user ? "Unsync" : "Sync"}
      </button>
    </div>
  </div>
);

SyncSection.propTypes = syncSectionPropTypes;

export const toggleSync = (
  syncBus: Bacon.Bus<any, boolean>,
  user: object | undefined
) => {
  syncBus.push(user === undefined);
};

export default SyncSection;
