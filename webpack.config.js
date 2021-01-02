const path = require("path");
const TimestampWebpackPlugin = require("timestamp-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const baseConfig = (mode, target) => {
  return {
    entry: {
      index: "./src/main.tsx"
    },
    mode,
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
    },
    plugins: [
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ['json','javascript']
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          loader: "ts-loader",
          options: {
            
            compilerOptions: {
              target
            }
          }
        },{
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    externals: {
      "monaco-editor": "monaco"
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist"),
      pathinfo: false
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    }
  };
};

function getConfigs(mode) {
  const ext = mode === 'production' ? 'min.js' : 'js';
  const common_es6 = {
    ...baseConfig(mode, "ES2017"),
    output: {
      filename: "[name]-commonjs-es6." + ext,
      path: path.join(__dirname, "dist")
    }
  };
  return [common_es6];
}

module.exports = (env, argv) => {
  return getConfigs("development")[0];
  // if (!argv.mode || argv.mode === "development") {
  //   return getConfigs("development");
  // } else {
  //   return getConfigs("development").concat(getConfigs("production"));
  // }
};
