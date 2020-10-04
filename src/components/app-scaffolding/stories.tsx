import * as React from "react";
import App from "./index";

export default {
  title: "AppScaffolding"
};

const bottomBar = <div style={{ background: "black" }}>Bottom Bar</div>;
const content = (
  <div style={{ background: "white", color: "black" }} tabIndex={0}>
    {new Array(100).fill(undefined).map((_, index) => (
      <div key={index}>Line number {index}</div>
    ))}
  </div>
);

export const Empty = () => <App />;
export const WithEmail = () => <App email="fip@rbelouin.com" />;
export const WithGithub = () => (
  <App github="https://github.com/rbelouin/fip.rbelouin.com" />
);
export const WithContent = () => <App>{content}</App>;
export const WithBottomBar = () => <App bottomBar={bottomBar} />;
export const WithAll = () => (
  <App
    email="fip@rbelouin.com"
    github="https://github.com/rbelouin/fip.rbelouin.com"
    bottomBar={bottomBar}
  >
    {content}
  </App>
);
