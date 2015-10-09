var _ = require("lodash");
var intl = module.exports;

intl.langs = {};
intl.langs.fr = require("./messages/fr-FR.json");
intl.langs.en = require("./messages/en-US.json");

intl.languages = typeof navigator != "undefined" && navigator.languages || ["en-US", "en"];

intl.getIntlData = function() {
  return _.find(intl.langs, function(data, intlLang) {
    return _.any(intl.languages, function(lang) {
      return lang.split("-")[0] === intlLang;
    });
  }) || intl.langs.en;
};
