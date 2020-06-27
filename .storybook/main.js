const path = require("path");

module.exports = {
  stories: ["../src/components/**/stories.tsx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-links"],
  webpackFinal: async config => {
    config.entry.unshift("./src/global.css");
    config.entry.unshift("./node_modules/font-awesome/less/font-awesome.less");

    config.resolve.extensions = config.resolve.extensions.concat([
      ".ts",
      ".tsx"
    ]);

    config.module.rules = [
      {
        test: /(\.js|\.jsx|\.ts|\.tsx)$/,
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
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
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
    ];

    return config;
  }
};
