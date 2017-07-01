const glob = require("glob");
const path = require("path");
const TapWebpackPlugin = require("tap-webpack-plugin");

module.exports = [{
  entry: [
    "./node_modules/whatwg-fetch/fetch.js",
    "./prod/js/index.js"
  ],
  output: {
    path: path.resolve("./prod/public/js/"),
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: "babel-loader"
    }]
  }
},{
  target: "node",
  entry: () => new Promise((resolve, reject) => {
    glob("./test/**/*.spec.js", function(err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  }),
  output: {
    "path": path.resolve("./output/"),
    "filename": "test.js"
  },
  plugins: [
    new TapWebpackPlugin()
  ]
}];
