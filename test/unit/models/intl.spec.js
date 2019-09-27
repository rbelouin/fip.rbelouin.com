import intl from "../../../src/js/models/intl.js";

test("intl.getIntlData should choose the right language", function(done) {
  intl.languages = ["en-US", "en"];
  expect(intl.getIntlData().locales).toStrictEqual("en-US");

  intl.languages = ["fr-FR", "fr"];
  expect(intl.getIntlData().locales).toStrictEqual("fr-FR");

  intl.languages = ["fr-CA"];
  expect(intl.getIntlData().locales).toStrictEqual("fr-FR");

  intl.languages = ["de-DE", "de"];
  expect(intl.getIntlData().locales).toStrictEqual("en-US");

  intl.languages = [];
  expect(intl.getIntlData().locales).toStrictEqual("en-US");

  done();
});
