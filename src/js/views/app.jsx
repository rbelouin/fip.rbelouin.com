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
      radio: "fip-radio",
      history: [],
      bsong: {type: "loading"},
      psong: {type: "loading"},
      src: null,
      favSongs: [],
      user: null
    };
  },
  componentWillMount: function() {
    _.each(this.props.state, function(stream, name) {
      stream.onValue(function(value) {
        const state = {};
        state[name] = value;

        this.setState(state);
      }.bind(this));
    }.bind(this));
  },
  render: function() {
    var page =  this.state.route === "favorites" ?
                  <Favorites
                    favSongs={this.state.favSongs}
                    favBus={this.props.favBus}
                    syncBus={this.props.syncBus}
                    playBus={this.props.playBus}
                    user={this.state.user}
                  /> :
                this.state.route === "radio" ?
                  <Radio
                    nowPlaying={this.state.bsong}
                    src={this.state.src}
                    pastSongs={this.state.history}
                    radio={this.state.radio}
                    radios={this.props.radios}
                    favBus={this.props.favBus}
                    playBus={this.props.playBus}
                  /> :
                "";

    var player = this.state.playerOnBottom ? (
      <Player
        playBus={this.props.playBus}
        src={this.state.src}
        nowPlaying={this.state.psong}
        radio={this.state.radio}
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
          radios={this.props.radios}
          playBus={this.props.playBus}
          src={this.state.src}
          nowPlaying={this.state.psong}
          route={this.state.route}
          radio={this.state.radio}
          paneIsOpen={this.state.paneIsOpen}
          playerOnBottom={this.state.playerOnBottom}
        />
      </div>
    );
  }
});
