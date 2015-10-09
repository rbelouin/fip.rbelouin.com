var test = require("tape");
var intl = require("../../../src/js/models/intl.js");

test("intl.getIntlData should choose the right language", function(t) {
  intl.languages = ["en-US", "en"];
  t.equal(intl.getIntlData().locales, "en-US");

  intl.languages = ["fr-FR", "fr"];
  t.equal(intl.getIntlData().locales, "fr-FR");

  intl.languages = ["fr-CA"];
  t.equal(intl.getIntlData().locales, "fr-FR");

  intl.languages = ["de-DE", "de"];
  t.equal(intl.getIntlData().locales, "en-US");

  intl.languages = [];
  t.equal(intl.getIntlData().locales, "en-US");

  t.end();
});
