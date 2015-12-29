var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Radio = require("./radio.jsx");
var Favorites = require("./favorites.jsx");

import AppNav from "./app-nav.jsx";
import Player from "./nav-player.jsx";

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      paneIsOpen: false,
      playerOnBottom: false,
      route: "radio",
      pastSongs: [],
      nowPlaying: {type: "loading"},
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

    this.props.p_playerOnBottom.onValue(function(playerOnBottom) {
      this.setState({"playerOnBottom": playerOnBottom});
    }.bind(this));

    this.props.p_favSongs.onValue(function(songs) {
      this.setState({"favSongs": songs});
    }.bind(this));

    this.props.p_user.onValue(function(user) {
      this.setState({"user": user});
    }.bind(this));

    this.props.p_pastSongs.onValue(function(songs) {
      this.setState({"pastSongs": songs});
    }.bind(this));

    this.props.p_nowPlaying.onValue(function(nowPlaying) {
      this.setState({"nowPlaying": nowPlaying});
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
                    nowPlaying={this.state.nowPlaying}
                    pastSongs={this.state.pastSongs}
                    favBus={this.props.favBus}
                  /> :
                "";

    var player = this.state.playerOnBottom ? (
      <Player
        src={this.props.url}
        nowPlaying={this.state.nowPlaying}
        onBottom={true}
      />
    ) : "";

    return (
      <div className="app">
        <main className="app-main container-fluid">
          {page}
        </main>
        {player}
        <AppNav
          src={this.props.url}
          nowPlaying={this.state.nowPlaying}
          route={this.state.route}
          paneIsOpen={this.state.paneIsOpen}
          playerOnBottom={this.state.playerOnBottom}
        />
      </div>
    );
  }
});
