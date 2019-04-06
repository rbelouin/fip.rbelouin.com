const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: ["./src/fip/radio-metadata/index.ts"],
  output: {
    path: path.resolve("output"),
    filename: "server.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      }
    ]
  }
};
