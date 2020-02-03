import * as React from "react";
const style = require("./style.css");

export const App: React.FunctionComponent<{}> = ({ children }) => (
  <div>
    <div className={style.root}>
      <button id="menu-toggle" className={style.button}>
        <span className={`${style.icon} glyphicon glyphicon-headphones`} />
      </button>
      <h1 className={style.title}>FIP player</h1>
    </div>
    {children}
  </div>
);

export default App;
