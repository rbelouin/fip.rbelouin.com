var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Intro = require("./intro.jsx");
var Player = require("./player.jsx");
var SongList = require("./player-song-list.jsx");

var A = require("./link.jsx");

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      play: false,
      paneIsOpen: false,
      route: "radio",
      songs: [],
      favSongs: []
    };
  },
  onPlay: function() {
    this.setState({"play": true});

    this.props.p_songs.onValue(function(songs) {
      this.setState({"songs": songs});
    }.bind(this));
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
  },
  renderRadio: function() {
    return this.state.play ? (
      <Player
        url={this.props.url}
        songs={this.state.songs}
        favBus={this.props.favBus}
      />
    ) : (
      <Intro onPlay={this.onPlay} />
    )
  },
  renderFavorites: function() {
    return (
      <SongList songs={this.state.favSongs} favBus={this.props.favBus} />
   );
  },
  render: function() {
    var paneIsOpen = this.state.paneIsOpen;
    var navClass = paneIsOpen ? "app-nav-open" : "app-nav-close";

    return (
      <div className="app">
        <main className="app-main container-fluid">
          {
            (this.state.route === "favorites") ?
              this.renderFavorites()
            : (this.state.route === "radio") ?
              this.renderRadio()
            : ""
          }
        </main>
        <nav className={"app-nav " + navClass}>
          <ul>
            <li>
              <A href="/">{this.getIntlMessage("fip-radio")}</A>
            </li>
            <li>
              <A href="/users/me/songs">{this.getIntlMessage("favorites")}</A>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
});
