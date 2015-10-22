var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Radio = require("./radio.jsx");
var Favorites = require("./favorites.jsx");
var AppNav = require("./app-nav.jsx");

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
  render: function() {
    var page =  this.state.route === "favorites" ?
                  <Favorites
                    favSongs={this.state.favSongs}
                    favBus={this.props.favBus}
                  /> :
                this.state.route === "radio" ?
                  <Radio
                    url={this.props.url}
                    play={this.state.play}
                    songs={this.state.songs}
                    favBus={this.props.favBus}
                    onPlay={this.onPlay}
                  /> :
                "";

    return (
      <div className="app">
        <main className="app-main container-fluid">
          {page}
        </main>
        <AppNav
          route={this.state.route}
          paneIsOpen={this.state.paneIsOpen}
        />
      </div>
    );
  }
});
