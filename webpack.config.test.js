const glob = require("glob");
const path = require("path");

const TapWebpackPlugin = require("tap-webpack-plugin");

module.exports = {
  mode: "development",
  target: "node",
  entry: () =>
    new Promise((resolve, reject) => {
      glob("./test/**/*.spec.js", function(err, files) {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    }),
  output: {
    path: path.resolve("./output/"),
    filename: "test.js"
  },
  plugins: [new TapWebpackPlugin({ reporter: "tap-spec" })]
};
