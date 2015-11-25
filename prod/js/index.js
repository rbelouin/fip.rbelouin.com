var {start} = require("../../src/js/index.jsx");
var routes = require("./routes.json");

start({
  DefaultLanguage: "en",
  FetchInterval: 2000,
  routes: routes
});
