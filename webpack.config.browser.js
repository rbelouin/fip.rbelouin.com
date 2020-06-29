const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("webapp-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const config = require("./prod/js/config.json");

module.exports = {
  mode: "production",
  entry: [
    "./node_modules/whatwg-fetch/fetch.js",
    "./src/global.css",
    "./prod/js/index.ts"
  ],
  output: {
    path: path.resolve("./prod/public/"),
    publicPath: "/",
    filename: "js/bundle.js"
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.ts|\.tsx$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              import: true,
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        use: [
          {
            loader: "file-loader",
            query: {
              outputPath: "fonts/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      path: path.resolve("./prod/public/"),
      filename: "all.css"
    }),
    new FaviconsWebpackPlugin({
      logo: "./assets/img/icon.png",
      background: "#222222"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./assets/html/index.html",
      inject: "body",
      trackingId: config.google_analytics.tracking_id
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
};
