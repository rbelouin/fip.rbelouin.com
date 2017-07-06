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
      exclude: /node_modules/,
      use: [
        "babel-loader",
        "eslint-loader"
      ]
    }]
  }
},{
  entry: "./src/less/all.less",
  output: {
    path: path.resolve("./prod/public/js/"),
    filename: "style.bundle.js"
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: "file-loader",
        query: {
          outputPath: "../css/",
          name: "[name].css"
        }
      },{
        loader: "extract-loader"
      },{
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
    },{
      test: /\.(eot|woff|woff2|ttf|svg)$/,
      use: [{
        loader: "file-loader",
        query: {
          outputPath: "../fonts/"
        }
      }]
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
