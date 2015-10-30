var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Radio = require("./radio.jsx");
var Favorites = require("./favorites.jsx");
var AppNav = require("./app-nav.jsx");
var Audio = require("./audio.jsx");

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      play: false,
      paneIsOpen: false,
      route: "radio",
      songs: [],
      favSongs: [],
      user: null,
      volume: 1
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

    this.props.p_user.onValue(function(user) {
      this.setState({"user": user});
    }.bind(this));

    this.props.volBus.onValue(function(volume) {
      this.setState({"volume": volume});
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
                    play={this.state.play}
                    songs={this.state.songs}
                    favBus={this.props.favBus}
                    volBus={this.props.volBus}
                    volume={this.state.volume}
                    onPlay={this.onPlay}
                  /> :
                "";

    return (
      <div className="app">
        <Audio src={this.props.url} type="audio/mpeg" volume={this.state.volume} play={this.state.play} />
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
