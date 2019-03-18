const util = require("util");
const glob = require("glob");
const path = require("path");

const TapWebpackPlugin = require("tap-webpack-plugin");
const g = util.promisify(glob);

module.exports = {
  mode: "development",
  target: "node",
  entry: () =>
    Promise.all([g("./test/unit/**/*.spec.js"), g("./src/**/test.ts")]).then(
      filesList => filesList.flat()
    ),
  output: {
    path: path.resolve("./output/"),
    filename: "test.js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      }
    ]
  },
  plugins: [new TapWebpackPlugin({ reporter: "tap-spec" })]
};
