var _ = require("lodash");
var Bacon = require("baconjs");

var emission = {
  "startTime": 1443736800,
  "endTime": 1443823199,
  "id": "emission-1",
  "title": "",
  "icons": {
    "small": "http://www.fipradio.fr/sites/all/modules/fip/fip_direct/images/direct_default_cover.png"
  },
  "link": "http://www.fipradio.fr/"
};

function getSong(index) {
  return {
    "startTime": 1443788526 + (5 + index) * 60,
    "endTime": 1443788526 + (5 + index + 1) * 60,
    "id": "song-" + index.toString(),
    "title": "THIS IS SONG N° " + index.toString(),
    "album": "ALBUM " + index.toString(),
    "artist": "ARTIST " + index.toString(),
    "year": "YEAR " + index.toString(),
    "label": "LABEL " + index.toString(),
    "icons": {
      "small": "http://www.fipradio.fr/sites/all/modules/custom/rf_rel/images/logo_65.png",
      "medium": "http://www.fipradio.fr/sites/all/modules/custom/rf_rel/images/logo_65.png"
    },
    "itunes": "https://itunes.apple.com/"
  };
}

var p_song = module.exports = Bacon.repeat(function(index) {
  var song = getSong(index);

  return index == 0 ? Bacon.once(song) : Bacon.later(10000, song);
}).toProperty();
