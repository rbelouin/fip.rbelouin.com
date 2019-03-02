import _ from "lodash";

import frMessages from "./messages/fr-FR.json";
import enMessages from "./messages/en-US.json";

import { addLocaleData } from "react-intl";

import frLocaleData from "react-intl/locale-data/fr";
import enLocaleData from "react-intl/locale-data/en";

addLocaleData([...frLocaleData, ...enLocaleData]);

const intl = {};
export default intl;

intl.langs = {};
intl.langs.fr = frMessages;
intl.langs.en = enMessages;

intl.languages = (typeof navigator != "undefined" && navigator.languages) || [
  "en-US",
  "en"
];

intl.getIntlData = function() {
  return (
    _.find(intl.langs, function(data, intlLang) {
      return _.some(intl.languages, function(lang) {
        return lang.split("-")[0] === intlLang;
      });
    }) || intl.langs.en
  );
};
