import _ from "lodash";
import frMessages from "./messages/fr-FR.json";
import enMessages from "./messages/en-US.json";

const intl = {};
export default intl;

intl.langs = {};
intl.langs.fr = frMessages;
intl.langs.en = enMessages;

intl.languages = typeof navigator != "undefined" && navigator.languages || ["en-US", "en"];

intl.getIntlData = function() {
  return _.find(intl.langs, function(data, intlLang) {
    return _.any(intl.languages, function(lang) {
      return lang.split("-")[0] === intlLang;
    });
  }) || intl.langs.en;
};
