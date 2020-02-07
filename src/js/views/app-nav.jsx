import React from "react";
import createReactClass from "create-react-class";
import { FormattedMessage } from "react-intl";
import { array, bool, string } from "prop-types";

import { Link } from "../../components/navigation";

export default createReactClass({
  displayName: "AppNav",
  propTypes: {
    route: string.isRequired,
    radio: string.isRequired,
    radios: array.isRequired,
    paneIsOpen: bool.isRequired
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
    const isOpen = this.props.paneIsOpen;
    const navClass = isOpen ? "app-nav-open" : "app-nav-close";

    const radios = this.props.radios.map(radio => {
      const href = `/radios/${radio.id}`;

      return (
        <li key={href} className={this.isRadioActive(radio.id)}>
          <Link href={href}>
            <FormattedMessage id={radio.id} />
          </Link>
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
            <Link href="/users/me/songs">
              <FormattedMessage id="favorites" />
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
});
