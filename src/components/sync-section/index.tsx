import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes, { InferProps } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { DispatchContext } from "../../events";
const style = require("./style.css");

export const syncSectionPropTypes = {
  user: PropTypes.shape({
    display_name: PropTypes.string.isRequired
  })
};

export type SyncSectionPropTypes = InferProps<typeof syncSectionPropTypes>;

export const SyncSection: React.FunctionComponent<SyncSectionPropTypes> = ({
  user
}) => {
  const dispatch = useContext(DispatchContext);
  return (
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
          onClick={() => dispatch("sync", !user)}
        >
          <FontAwesomeIcon icon={faSpotify} />
          {user ? "Unsync" : "Sync"}
        </button>
      </div>
    </div>
  );
};

SyncSection.propTypes = syncSectionPropTypes;

export default SyncSection;
