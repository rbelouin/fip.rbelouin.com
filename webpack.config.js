const glob = require("glob");
const path = require("path");

const TapWebpackPlugin = require("tap-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const config = require("./prod/js/config.json");

module.exports = [{
  entry: [
    "./node_modules/whatwg-fetch/fetch.js",
    "./prod/js/index.js",
    "./src/less/all.less",
  ],
  output: {
    path: path.resolve("./prod/public/"),
    publicPath: "/",
    filename: "js/bundle.js"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        "babel-loader",
        "eslint-loader"
      ]
    },{
      test: /\.less$/,
      use: ExtractTextWebpackPlugin.extract({
        use: [{
          loader: "css-loader"
        },{
          loader: "less-loader",
          options: {
            paths: [
              path.resolve("./node_modules/bootstrap/less/"),
              path.resolve("./node_modules/font-awesome/less/")
            ]
          }
        }]
      })
    },{
      test: /\.(eot|woff|woff2|ttf|svg)$/,
      use: [{
        loader: "file-loader",
        query: {
          outputPath: "fonts/"
        }
      }]
    }]
  },
  plugins: [
    new ExtractTextWebpackPlugin("css/all.css"),
    new FaviconsWebpackPlugin({
      logo: "./src/img/icon.png",
      background: "#222222"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/html/index.html",
      inject: "body",
      trackingId: config.google_analytics.tracking_id
    })
  ]
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
