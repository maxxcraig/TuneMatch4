const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    optimization: {
      minimize: !isDevelopment,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
      }),
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),
    ],
    devServer: {
      static: path.resolve(__dirname, "dist"),
      historyApiFallback: true,
      hot: true,
      port: 8080,
    },
    devtool: isDevelopment ? "nosources-source-map" : "hidden-source-map",  // remember to revert
  };
};
