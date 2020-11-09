const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    resolve: {
        alias: {
            vue: 'vue/dist/vue.runtime.esm.js'
        }
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new TerserPlugin(),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
                canPrint: true
            })
        ],
    }
})
