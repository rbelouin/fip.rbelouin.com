const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "production",
  target: "node",
  entry: ["./src/server/index.ts"],
  output: {
    path: path.resolve("output"),
    filename: "server.js"
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new NodemonPlugin(),
    new webpack.DefinePlugin({
      "process.env.PUBLIC_FOLDER": JSON.stringify(
        path.resolve(__dirname, "prod", "public")
      )
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
};
