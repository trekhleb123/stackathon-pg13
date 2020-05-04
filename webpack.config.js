const isDev = process.env.NODE_ENV === "development"

module.exports = {
  mode: isDev ? "development" : "production",
  entry: [
    "@babel/polyfill", // enables async-await
    "./index.js",
    "./content.js",
    "./background.js",
  ],
  resolve: {
    extensions: [".js"],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    path: __dirname + "/public", // the absolute path for the directory where we want the output to be placed
    filename: "bundle.js", // the name of the file that will contain our output - we could name this whatever we want, but bundle.js is typical
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
}
