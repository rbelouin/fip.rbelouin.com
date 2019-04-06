const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: ["./src/server/index.ts"],
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
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PUBLIC_FOLDER": JSON.stringify(
        path.resolve(__dirname, "prod", "public")
      )
    })
  ]
};
