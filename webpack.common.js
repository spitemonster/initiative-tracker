// webpack v4

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: { main: './src/js/index.ts' },
    output: {
        path: path.resolve(`${__dirname}`),
        filename: 'dist/js/main.js'
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "dist/css/style.css"
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }
};
