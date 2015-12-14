var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Radio = require("./radio.jsx");
var Favorites = require("./favorites.jsx");

import AppNav from "./app-nav.jsx";

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      paneIsOpen: false,
      route: "radio",
      songs: [],
      favSongs: [],
      user: null
    };
  },
  componentWillMount: function() {
    this.props.p_route.onValue(function(route) {
      this.setState({"route": route});
    }.bind(this));

    this.props.p_paneIsOpen.onValue(function(paneIsOpen) {
      this.setState({"paneIsOpen": paneIsOpen});
    }.bind(this));

    this.props.p_favSongs.onValue(function(songs) {
      this.setState({"favSongs": songs});
    }.bind(this));

    this.props.p_user.onValue(function(user) {
      this.setState({"user": user});
    }.bind(this));

    this.props.p_songs.onValue(function(songs) {
      this.setState({"songs": songs});
    }.bind(this));
  },
  render: function() {
    var page =  this.state.route === "favorites" ?
                  <Favorites
                    favSongs={this.state.favSongs}
                    favBus={this.props.favBus}
                    syncBus={this.props.syncBus}
                    user={this.state.user}
                  /> :
                this.state.route === "radio" ?
                  <Radio
                    songs={this.state.songs}
                    favBus={this.props.favBus}
                  /> :
                "";

    return (
      <div className="app">
        <main className="app-main container-fluid">
          {page}
        </main>
        <AppNav
          src={this.props.url}
          song={_.head(this.state.songs)}
          route={this.state.route}
          paneIsOpen={this.state.paneIsOpen}
        />
      </div>
    );
  }
});
