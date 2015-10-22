var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var A = require("./link.jsx");

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  isActive: function(route) {
    return this.props.route === route ? "active" : "";
  },
  render: function() {
    var paneIsOpen = this.props.paneIsOpen;
    var navClass = paneIsOpen ? "app-nav-open" : "app-nav-close";

    return (
      <nav className={"app-nav " + navClass}>
        <ul>
          <li className={this.isActive("radio")}>
            <A href="/">{this.getIntlMessage("fip-radio")}</A>
          </li>
          <li className={this.isActive("favorites")}>
            <A href="/users/me/songs">{this.getIntlMessage("favorites")}</A>
          </li>
        </ul>
      </nav>
    );
  }
});
