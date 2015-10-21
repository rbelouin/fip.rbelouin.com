var FipClient = require("../../src/js/index.jsx");
var routes = require("./routes.json");

FipClient.start({
  DefaultLanguage: "en",
  FetchInterval: 2000,
  routes: routes
});
