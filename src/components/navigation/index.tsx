import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Bacon from "baconjs";
import PropTypes, { InferProps, Validator } from "prop-types";
import { Radio } from "../../types";
const style = require("./style.css");

import * as MIDI from "../../midi";

type BaconRoutes = typeof Bacon & {
  history: typeof window.history;
};

export const navigationPropTypes = {
  route: PropTypes.string.isRequired,
  radio: PropTypes.string.isRequired,
  radios: PropTypes.arrayOf(
    (PropTypes.object.isRequired as any) as Validator<Radio>
  ).isRequired
};

export type NavigationPropTypes = InferProps<typeof navigationPropTypes>;

export type NavigationCSSProperties = React.CSSProperties & {
  "--navigation-items-count"?: number;
  "--navigation-item-color"?: string;
};

export const Navigation: React.FunctionComponent<NavigationPropTypes> = ({
  route,
  radio,
  radios
}) => {
  useEffect(() => {
    return MIDI.getNoteOnEvents()
      .map(pitch => radios[pitch - 60])
      .filter(radioItem => radioItem !== undefined)
      .onValue(radioItem => navigateTo(getRadioUrl(radioItem)));
  }, []);

  return (
    <nav>
      <ul
        className={style.navigation}
        style={
          {
            "--navigation-items-count": 1 + radios.length
          } as NavigationCSSProperties
        }
      >
        {radios.map(radioItem => (
          <NavigationItem
            key={radioItem.id}
            href={getRadioUrl(radioItem)}
            messageId={radioItem.id}
            color={radioItem.color}
            active={isRadiosActive(route) && radio === radioItem.id}
          />
        ))}
        <NavigationItem
          href="/users/me/songs"
          messageId="favorites"
          active={isFavoritesActive(route)}
          color={getComputedStyle(document.body).getPropertyValue(
            "--green-spotify"
          )}
        />
      </ul>
    </nav>
  );
};

Navigation.propTypes = navigationPropTypes;
export default Navigation;

function getRadioUrl(radio: Radio): string {
  return `/radios/${radio.id}`;
}

function isFavoritesActive(route: string) {
  return route === "favorites";
}

function isRadiosActive(route: string) {
  return route === "radio";
}

export const navigationItemPropTypes = {
  href: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  color: PropTypes.string,
  active: PropTypes.bool
};

export type NavigationItemPropTypes = InferProps<
  typeof navigationItemPropTypes
>;

export const NavigationItem: React.FunctionComponent<NavigationItemPropTypes> = ({
  href,
  messageId,
  color,
  active
}) => (
  <li
    className={`${style.navigationItem} ${active ? "active" : ""}`}
    style={{ "--navigation-item-color": color } as NavigationCSSProperties}
  >
    <Link href={href}>
      <FormattedMessage id={messageId} />
    </Link>
  </li>
);

NavigationItem.propTypes = navigationItemPropTypes;

export const linkPropTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node
};

export type LinkPropTypes = InferProps<typeof linkPropTypes>;

export const Link: React.FunctionComponent<LinkPropTypes> = ({
  href,
  children
}) => (
  <a
    href={href}
    className={style.navigationItemLink}
    onClick={onLinkClick(href)}
  >
    {children}
  </a>
);

Link.propTypes = linkPropTypes;

const onLinkClick = (href: string) => (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  event.preventDefault();
  navigateTo(href);
};

const navigateTo = (href: string) =>
  (Bacon as BaconRoutes).history.pushState(null, "", href);
