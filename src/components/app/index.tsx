import * as React from "react";
const style = require("./style.css");

export type AppPropTypes = {
  email?: string;
  github?: string;
};

export const App: React.FunctionComponent<AppPropTypes> = ({
  email,
  github,
  children
}) => (
  <div>
    <div className={style.root}>
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
              target="_blank"
              className={`${style.link} fa fa-github`}
              aria-label="Visit the Github page"
            />
          </div>
        )}
      </div>
    </div>
    {children}
  </div>
);

export default App;
