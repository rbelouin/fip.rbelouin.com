var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;

var Intro = require("./intro.jsx");
var Player = require("./player.jsx");

var App = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      play: false,
      paneIsOpen: false,
      songs: []
    };
  },
  onPlay: function() {
    this.setState({
      play: true,
      paneIsOpen: this.state.paneIsOpen,
      songs: []
    });

    this.props.p_songs.onValue(function(songs) {
      this.setState({
        play: true,
        paneIsOpen: this.state.paneIsOpen,
        songs: songs
      });
    }.bind(this));
  },
  componentWillMount: function() {
    this.props.p_paneIsOpen.onValue(function(paneIsOpen) {
      this.setState({
        play: this.state.play,
        paneIsOpen: paneIsOpen,
        songs: this.state.songs
      });
    }.bind(this));
  },
  render: function() {
    var paneIsOpen = this.state.paneIsOpen;
    var navClass = paneIsOpen ? "app-nav-open" : "app-nav-close";

    return (
      <div className="app">
        <main className="app-main container-fluid">
          {
            this.state.play ? (
              <Player url={this.props.url} songs={this.state.songs} favBus={this.props.favBus} />
            ) : (
              <Intro onPlay={this.onPlay} />
            )
          }
        </main>
        <nav className={"app-nav " + navClass}>
          <ul>
            <li>
              <a href="#">{this.getIntlMessage("fip-radio")}</a>
            </li>
            <li>
              <a href="#">{this.getIntlMessage("favorites")}</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
});
