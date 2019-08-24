const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("webapp-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = require("./prod/js/config.json");

module.exports = {
  mode: "production",
  entry: [
    "./node_modules/whatwg-fetch/fetch.js",
    "./prod/js/index.js",
    "./src/less/all.less"
  ],
  output: {
    path: path.resolve("./prod/public/"),
    publicPath: "/",
    filename: "js/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              paths: [
                path.resolve("./node_modules/bootstrap/less/"),
                path.resolve("./node_modules/font-awesome/less/")
              ]
            }
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
    })
  ]
};