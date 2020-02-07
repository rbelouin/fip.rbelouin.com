import React from "react";
import Bacon from "baconjs";
import PropTypes, { InferProps } from "prop-types";

type BaconRoutes = typeof Bacon & {
  history: typeof window.history;
};

export const linkPropTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node
};

export type LinkPropTypes = InferProps<typeof linkPropTypes>;

export const Link: React.FunctionComponent<LinkPropTypes> = ({
  href,
  children
}) => (
  <a href={href} onClick={onLinkClick(href)}>
    {children}
  </a>
);

const onLinkClick = (href: string) => (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  event.preventDefault();
  (Bacon as BaconRoutes).history.pushState(null, "", href);
};
