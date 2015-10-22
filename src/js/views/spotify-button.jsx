var React = require("react");
var IntlMixin = require("react-intl").IntlMixin;

var SpotifyButton = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <a
        href={this.props.song.spotify}
        target="_blank"
        className="player-controls-spotify"
      >
        <span className="player-controls-spotify-icon glyphicon glyphicon-music"></span>
        {this.getIntlMessage("open-in-spotify")}
      </a>
    );
  }
});
