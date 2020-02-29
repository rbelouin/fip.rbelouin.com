import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Bacon from "baconjs";
import PropTypes, { InferProps, Validator } from "prop-types";
import { Radio, Song, NowPlaying } from "../../types";
const style = require("./style.css");

import * as MIDI from "../../midi";

type BaconRoutes = typeof Bacon & {
  history: typeof window.history;
};

export type SongPlaying = NowPlaying & { type: "song" };
export type RadiosState = {
  [name: string]: {
    nowPlaying: { type: "loading" } | SongPlaying;
  };
};

export const navigationPropTypes = {
  route: PropTypes.string.isRequired,
  radio: PropTypes.string.isRequired,
  radios: (PropTypes.object.isRequired as any) as Validator<RadiosState>,
  favoriteSongs: PropTypes.arrayOf(
    (PropTypes.object.isRequired as any) as Validator<Song>
  ).isRequired
};

export type NavigationPropTypes = InferProps<typeof navigationPropTypes>;

export type NavigationCSSProperties = React.CSSProperties & {
  "--navigation-items-count"?: number;
  "--navigation-item-color"?: string;
  "--navigation-item-background"?: string;
};

export const Navigation: React.FunctionComponent<NavigationPropTypes> = ({
  route,
  radio,
  radios,
  favoriteSongs
}) => {
  useEffect(() => {
    return MIDI.getNoteOnEvents()
      .map(pitch => Object.values(radios)[pitch - 60])
      .map(item => item && item.nowPlaying)
      .filter(nowPlaying => nowPlaying && nowPlaying.type === "song")
      .onValue(nowPlaying =>
        navigateTo(getRadioUrl((nowPlaying as SongPlaying).radio))
      );
  }, [radios]);

  const favoriteBackground =
    favoriteSongs.length === 0
      ? undefined
      : favoriteSongs[Math.floor(Math.random() * favoriteSongs.length)].icons
          .medium;

  return (
    <nav>
      <ul
        className={style.navigation}
        style={
          {
            "--navigation-items-count": 1 + Object.values(radios).length
          } as NavigationCSSProperties
        }
      >
        {Object.values(radios)
          .filter(({ nowPlaying }) => nowPlaying.type !== "loading")
          .map(item => {
            const { radio: radioItem, song } = item.nowPlaying as SongPlaying;
            return (
              <NavigationItem
                key={radioItem.id}
                href={getRadioUrl(radioItem)}
                messageId={radioItem.id}
                color={radioItem.color}
                backgroundImage={song && song.icons.medium}
                active={isRadiosActive(route) && radio === radioItem.id}
              />
            );
          })}
        <NavigationItem
          href="/users/me/songs"
          messageId="favorites"
          active={isFavoritesActive(route)}
          color={getComputedStyle(document.body).getPropertyValue(
            "--green-spotify"
          )}
          backgroundImage={favoriteBackground}
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
  backgroundImage: PropTypes.string,
  active: PropTypes.bool
};

export type NavigationItemPropTypes = InferProps<
  typeof navigationItemPropTypes
>;

export const NavigationItem: React.FunctionComponent<NavigationItemPropTypes> = ({
  href,
  messageId,
  color,
  backgroundImage,
  active
}) => (
  <li
    className={`${style.navigationItem} ${active ? "active" : ""}`}
    style={
      {
        "--navigation-item-color": color,
        "--navigation-item-background":
          backgroundImage && `url("${backgroundImage}")`
      } as NavigationCSSProperties
    }
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
