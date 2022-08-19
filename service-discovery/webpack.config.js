const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const contract = require("./webpack.contract");

const getFormattedBranchName = () => {
  const branch = process.env.BRANCH_TO_BUILD
  if (!branch) {
    return "local"
  }

  return branch.replace(/.*\//, "").toLowerCase()
}

module.exports = (env, argv) => ({
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "./public"),
    publicPath: "auto",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },

  devServer: {
    ...contract.devServer,
    static: path.join(__dirname, "dist"),
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: contract.moduleFederationPlugin.name,
      filename: argv.mode === "development"
        ? `${contract.moduleFederationPlugin.file.name}.${contract.moduleFederationPlugin.file.extension}`
        : `${
          contract.moduleFederationPlugin.file.name
        }.${getFormattedBranchName()}.[contenthash].${
          contract.moduleFederationPlugin.file.extension
        }`,
      remotes: {},
      exposes: {
        "./Utils": "./src/loadFederatedModule",
      },
      shared: {},
    }),
  ],
});
