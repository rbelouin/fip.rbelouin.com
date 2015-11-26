var _ = require("lodash");
var Bacon = require("baconjs");
var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Song = require("./player-song.jsx");

var SongList = module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div>
        <SongList.table
          songs={this.props.songs}
          favBus={this.props.favBus}
        />
        <SongList.ul
          songs={this.props.songs}
          favBus={this.props.favBus}
        />
      </div>
    );
  }
});

SongList.table = React.createClass({
  mixins: [IntlMixin],
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var songNodes = this.props.songs.map(function(song) {
      return (
        <Song.tr
          song={song}
          key={song.id}
          toggleFavorite={_.partial(this.toggleFavorite, song)}
        />
      );
    }, this);

    return _.isEmpty(this.props.songs) ? (
      <table className="song-list"></table>
    ) : (
      <table className="song-list table">
        <thead>
          <tr>
            <th></th>
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
    );
  }
});

SongList.ul = React.createClass({
  mixins: [IntlMixin],
  toggleFavorite: function(song) {
    this.props.favBus.push({
      type: song.favorite ? "remove" : "add",
      song: song
    });
  },
  render: function() {
    var songNodes = this.props.songs.map(function(song) {
      return <Song.li song={song} key={song.id} />;
    });

    return _.isEmpty(this.props.songs) ? (
      <ul className="song-list"></ul>
    ) : (
      <ul className="song-list">
        {songNodes}
      </ul>
    );
  }
});
