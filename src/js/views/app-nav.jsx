import React from "react";
import ReactIntl from "react-intl";

import A from "./link.jsx";
import Player from "./nav-player.jsx";

const IntlMixin = ReactIntl.IntlMixin;

export default React.createClass({
  mixins: [IntlMixin],
  isActive: function(route) {
    return this.props.route === route ? "active" : "";
  },
  isRadioActive: function(radio) {
    return this.props.route === "radio" && this.props.radio === radio ? "active" : "";
  },
  render: function() {
    const src = this.props.src;
    const nowPlaying = this.props.nowPlaying;
    const isOpen = this.props.paneIsOpen;
    const playBus = this.props.playBus;
    const navClass = isOpen ? "app-nav-open" : "app-nav-close";

    const player = !this.props.playerOnBottom ? (
      <Player src={src} nowPlaying={nowPlaying} playBus={playBus} radio={this.props.radio} />
    ) : "";

    const radios = this.props.radios.map(radio => {
      const href = `/radios/${radio.name}`;
      const name = this.getIntlMessage(radio.name);

      return (
        <li className={this.isRadioActive(radio.name)}>
          <A href={href}>{name}</A>
        </li>
      );
    });

    return (
      <nav className={"app-nav " + navClass}>
        <ul>
          <li className={"app-nav-group " + this.isActive("radio")}>
            <div>{this.getIntlMessage("radios")}</div>
            <ul>
              {radios}
            </ul>
          </li>
          <li className={this.isActive("favorites")}>
            <A href="/users/me/songs">{this.getIntlMessage("favorites")}</A>
          </li>
        </ul>
        {player}
      </nav>
    );
  }
});
