const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

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
