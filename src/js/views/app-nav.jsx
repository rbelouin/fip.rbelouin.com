import React from "react";
import createReactClass from "create-react-class";
import { FormattedMessage } from "react-intl";
import { array, bool, object, string } from "prop-types";

import A from "./link.jsx";
import Player from "./nav-player.jsx";

export default createReactClass({
  displayName: "AppNav",
  propTypes: {
    route: string.isRequired,
    radio: string.isRequired,
    radios: array.isRequired,
    src: string,
    nowPlaying: object.isRequired,
    paneIsOpen: bool.isRequired,
    playBus: object.isRequired,
    playerOnBottom: bool.isRequired
  },
  isActive: function(route) {
    return this.props.route === route ? "active" : "";
  },
  isRadioActive: function(radio) {
    return this.props.route === "radio" && this.props.radio === radio
      ? "active"
      : "";
  },
  render: function() {
    const src = this.props.src;
    const nowPlaying = this.props.nowPlaying;
    const isOpen = this.props.paneIsOpen;
    const playBus = this.props.playBus;
    const navClass = isOpen ? "app-nav-open" : "app-nav-close";

    const player = !this.props.playerOnBottom ? (
      <Player
        src={src}
        nowPlaying={nowPlaying}
        playBus={playBus}
        radio={this.props.radio}
        onBottom={false}
      />
    ) : (
      ""
    );

    const radios = this.props.radios.map(radio => {
      const href = `/radios/${radio.id}`;

      return (
        <li key={href} className={this.isRadioActive(radio.id)}>
          <A href={href}>
            <FormattedMessage id={radio.id} />
          </A>
        </li>
      );
    });

    return (
      <nav className={"app-nav " + navClass}>
        <ul>
          <li className={"app-nav-group " + this.isActive("radio")}>
            <div>
              <FormattedMessage id="radios" />
            </div>
            <ul>{radios}</ul>
          </li>
          <li className={this.isActive("favorites")}>
            <A href="/users/me/songs">
              <FormattedMessage id="favorites" />
            </A>
          </li>
        </ul>
        {player}
      </nav>
    );
  }
});
