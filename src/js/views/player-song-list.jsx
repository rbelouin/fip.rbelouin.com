var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var SongItem = React.createClass({
  render: function() {
    return (
      <tr key={"table-" + this.props.song.id}>
        <td className={this.props.song.favorite ? "player-history-favorite" : ""}>
          <span className="glyphicon glyphicon-heart" onClick={this.props.toggleFavorite}></span>
        </td>
        <td>{this.props.song.title}</td>
        <td>{this.props.song.artist}</td>
        <td>{this.props.song.album}</td>
        <td>{this.props.song.year}</td>
        <td>{this.props.song.label}</td>
      </tr>
    );
  }
});

var Song = require("./player-song.jsx");

var SongList = module.exports = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      songs: []
    };
  },
  componentDidMount: function() {
    var p_songs = this.props.p_songs.flatMapLatest(function(songs) {
      return this.props.favStream.map(function(ev) {
        return _.map(songs, function(song) {
          return ev.song != song.id ? song : _.extend({}, song, {
            favorite: ev.type === "added"
          });
        });
      }).toProperty(songs);
    }.bind(this));

    p_songs.onValue(function(songs) {
      this.setState({songs: songs});
    }.bind(this));
  },
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var songNodes = this.state.songs.map(function(song) {
      return (
        <SongItem song={song} toggleFavorite={function() {
          this.toggleFavorite(song);
        }.bind(this)} />
      );
    }, this);

    var songNodes2 = this.state.songs.map(function(song) {
      return (
        <li key={"ul-" + song.id}>
          <Song p_song={Bacon.constant(song)} />
        </li>
      );
    });

    return _.isEmpty(this.state.songs) ? (
      <div>
        <table className="player-history"></table>
        <ul className="player-history"></ul>
      </div>
    ) : (
      <div>
        <table className="player-history table">
          <thead>
            <tr>
              <th></th>
              <th>
                <FormattedMessage message={this.getIntlMessage("title")} />
              </th>
              <th>
                <FormattedMessage message={this.getIntlMessage("artist")} />
              </th>
              <th>
                <FormattedMessage message={this.getIntlMessage("album")} />
              </th>
              <th>
                <FormattedMessage message={this.getIntlMessage("year")} />
              </th>
              <th>
                <FormattedMessage message={this.getIntlMessage("label")} />
              </th>
            </tr>
          </thead>
          <tbody>
            {songNodes}
          </tbody>
        </table>
        <ul className="player-history">
          {songNodes2}
        </ul>
      </div>
    );
  }
});
