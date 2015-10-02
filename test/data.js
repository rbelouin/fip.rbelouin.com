var _ = require("lodash");
var Bacon = require("baconjs");

var emission = {
  "startTime": 1443736800,
  "endTime": 1443823199,
  "id": "emission-1",
  "titre": "",
  "visuel": {
    "small": "http://www.fipradio.fr/sites/all/modules/fip/fip_direct/images/direct_default_cover.png"
  },
  "lien": "http://www.fipradio.fr/"
};

function getSong(index) {
  return {
    "startTime": 1443788526 + (5 + index) * 60,
    "endTime": 1443788526 + (5 + index + 1) * 60,
    "id": "song-" + index.toString(),
    "titre": index.toString(),
    "titreAlbum": "ALBUM " + index.toString(),
    "interpreteMorceau": "ARTIST " + index.toString(),
    "anneeEditionMusique": "YEAR " + index.toString(),
    "label": "LABEL " + index.toString(),
    "visuel": {
      "small": "http://www.fipradio.fr/sites/all/modules/custom/rf_rel/images/logo_65.png",
      "medium": "http://www.fipradio.fr/sites/all/modules/custom/rf_rel/images/logo_65.png"
    },
    "lien": "https://itunes.apple.com/"
  };
}

var p_song = module.exports = Bacon.repeat(function(index) {
  var song = {
    "current": {
      "emission": emission,
      "song": getSong(index + 2)
    },
    "previous2": {
      "song": getSong(index)
    },
    "previous1": {
      "song": getSong(index + 1)
    },
    "next1": {
      "song": getSong(index + 3)
    },
    "next2": {
      "song": getSong(index + 4)
    }
  };

  return index == 0 ? Bacon.once(song) : Bacon.later(10000, song);
}).toProperty();
