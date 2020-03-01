import * as React from "react";
import PropTypes, { InferProps } from "prop-types";
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
          <span className={`${style.icon} glyphicon glyphicon-headphones`} />
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
              className={`${style.link} fa fa-envelope`}
              aria-label="Send an email"
            />
          </div>
        )}
        {github && (
          <div className={style.linkContainer}>
            <a
              href={github}
              rel="noopener noreferrer"
              target="_blank"
              className={`${style.link} fa fa-github`}
              aria-label="Visit the Github page"
            />
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
