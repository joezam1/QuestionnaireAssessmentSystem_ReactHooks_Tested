const path = require("path");
//const EnvConfig = require("./src/configuration/environment/EnvConfig");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

var jsEntryPath = path.join(__dirname, './index.js');
var htmlEntryPath = path.resolve(__dirname, './index.html');
var allFilesOutputPath = path.resolve(__dirname, 'dist');

var htmlTemplate = { template: htmlEntryPath, title: 'Development' }
const htmlPlugin = new HtmlWebpackPlugin(htmlTemplate);

const cleanWebpackPlugin = new CleanWebpackPlugin();
const nodePolyfillPlugin = new NodePolyfillPlugin();

module.exports = {
    devtool: 'source-map',
    entry: [jsEntryPath],
    mode: "development",
    output: {
        filename: "bundle.js",
        path: allFilesOutputPath,
        publicPath: "/"
    },
    resolve: {

        fallback: {
            "path": require.resolve("path-browserify"),
            "http": false,
            "browser": false,
            "https": false,
            "stream": false,
            "url": false,
            "buffer": false,
            "timers": false,
            "crypto": false,
            "crypto-browserify": require.resolve('crypto-browserify')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.html$/,
                use: "html-loader"
            },
            /* Choose only one of the following two: if you're using 
              plain CSS, use the first one, and if you're using a 
              preprocessor, in this case SASS, use the second one */
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 5080
    },
    plugins: [htmlPlugin, cleanWebpackPlugin, nodePolyfillPlugin ],
    resolve: {
        extensions: ['.css', '.scss', '.js', '.jsx']
    }
};