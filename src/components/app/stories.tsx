import * as React from "react";
import App from "./index";

export default {
  title: "App"
};

export const Empty = () => <App />;
export const WithEmail = () => <App email="fip@rbelouin.com" />;
export const WithGithub = () => (
  <App github="https://github.com/rbelouin/fip.rbelouin.com" />
);
export const WithBoth = () => (
  <App
    email="fip@rbelouin.com"
    github="https://github.com/rbelouin/fip.rbelouin.com"
  />
);
