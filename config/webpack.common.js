/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');

/**
 * Webpack Plugins
 *
 * problem with copy-webpack-plugin
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractVendor = new ExtractTextPlugin('vendor.css');

/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
    title: '',
    baseUrl: '/',
    // isDevServer: helpers.isWebpackDevServer(),
    HMR: HMR
};

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
    isProd = options.env === 'production';
    return {
        entry: {
            'polyfills': './src/polyfills.main.js',
            'main':  './src/app.module.js'
        },
        resolve: {
            extensions: ['.js', '.json'],
            modules: [helpers.root('src'), helpers.root('node_modules'), helpers.root('web_modules')],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['babel-preset-env']
                        }
                    }
                },

                // 外部引入的css
                {
                    test: /\.css$/,
                    use: extractVendor.extract({
                        use: 'css-loader'
                    }),
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ico|FBX)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10,
                        name: 'assets/images/[name].[ext]'
                    }
                },
                {
                    test: /\.json|.json.js?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10,
                        name: 'json/[name].[ext]'
                    }
                },
                {
                    // 视频加载
                    test: /\.(mp4|flv|swf|ogg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=assets/video/[name].[ext]'
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: 'assets/fonts/[name].[hash:7].[ext]'
                    }
                }

            ],

        },
        plugins: [
            extractVendor,
            new CheckerPlugin(),
            new CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills']
            }),
            new ProvidePlugin({
                // ...
                $: "jquery",
                jQuery: "jquery",
                'window.jQuery': "jquery",
                moment: 'moment'
            }),
            new HtmlWebpackPlugin({
                favicon: './src/favicon.ico', // favicon路径
                title: '系统登录 - 智慧电厂综合安防平台',
                template: './src/index.html',
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body'
            }),
            new ScriptExtHtmlWebpackPlugin({
                sync: /polyfills|vendor/,
                defaultAttribute: 'async',
                preload: [/polyfills|vendor|main/],
                prefetch: [/chunk/]
            }),
        ]

    };
}
