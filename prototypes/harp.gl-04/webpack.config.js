const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");

// this webpack config consists of two generated bundles.
// 1. The bundle that is loaded in the web worker to do background tasks
// 2. The main bundle.

module.exports = [
    {
        entry: {
            app: "./src/ts/App.ts",
        },
        output: {
            filename: "[name].bundle.js",
        },
        devtool: 'source-map',
        externals: [
            {
                three: "THREE",
            },
            function(context, request, callback) {
                return /three\.module\.js$/.test(request) ? callback(null, "THREE") : callback();
            }
        ],
        resolve: {
            extensions: [".webpack.js", ".web.ts", ".ts", ".tsx", ".web.js", ".js", ".json"],
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loader: "ts-loader" },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ]
        },
        performance: {
            hints: false
        },
        mode: process.env.NODE_ENV || "development",
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.ejs'),
                inject: false,
                templateParameters: function(compilation, assets, options) {
                    return {
                        title: 'Document title',
                        files: assets,
                        options: options,
                        webpackConfig: compilation.options
                    }
                }
            }),
            new CopyWebpackPlugin([
                {
                    from: "node_modules/@here/harp-map-theme/resources",
                    to: "resources",
                    toType: "dir"
                },
                require.resolve("three/build/three.min.js")
            ])
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            port: 443,
            host: '0.0.0.0',
            https: true,
            disableHostCheck: true,
        },
        stats: {
            all: false,
            timings: true,
            exclude: "/resources/",
            errors: true,
            entrypoints: true,
            warnings: true
        }
    },
    {
        target: "webworker",
        entry: {
            decoder: "./src/ts/workers/HarpWorker.ts",
        },
        output: {
            filename: "[name].bundle.js",
        },
        devtool: 'source-map',
        externals: [
            {
                three: "THREE",
            },
            function(context, request, callback) {
                return /three\.module\.js$/.test(request) ? callback(null, "THREE") : callback();
            }
        ],
        resolve: {
            extensions: [".webpack.js", ".web.ts", ".ts", ".tsx", ".web.js", ".js"],
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loader: "ts-loader" },
            ]
        },
        performance: {
            hints: false
        },
        mode: process.env.NODE_ENV || "development"
    }
]
