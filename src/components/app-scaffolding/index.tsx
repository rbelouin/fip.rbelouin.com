import * as React from "react";
import PropTypes, { InferProps } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
const style = require("./style.css");

export const appScaffoldingPropTypes = {
  email: PropTypes.string,
  github: PropTypes.string,
  bottomBar: PropTypes.node,
  children: PropTypes.node
};

export type AppScaffoldingPropTypes = InferProps<
  typeof appScaffoldingPropTypes
>;

export const AppScaffolding: React.FunctionComponent<AppScaffoldingPropTypes> = ({
  email,
  github,
  bottomBar,
  children
}) => (
  <div className={style.root}>
    <div className={style.startBar}>
      <div className={style.startSection}>
        <button id="menu-toggle" className={style.button}>
          <FontAwesomeIcon className={style.icon} icon={faHeadphones} />
        </button>
        <h1 className={style.title}>FIP player</h1>
      </div>
      <div className={style.endSection}>
        {email && (
          <div className={style.linkContainer}>
            <a
              href={`mailto:${email}`}
              rel="noopener noreferrer"
              target="_blank"
              className={style.link}
              aria-label="Send an email"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
        )}
        {github && (
          <div className={style.linkContainer}>
            <a
              href={github}
              rel="noopener noreferrer"
              target="_blank"
              className={style.link}
              aria-label="Visit the Github page"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        )}
      </div>
    </div>
    <div className={style.middleContent}>{children}</div>
    {bottomBar && <div className={style.bottomBar}>{bottomBar}</div>}
  </div>
);

AppScaffolding.propTypes = appScaffoldingPropTypes;

export default AppScaffolding;
