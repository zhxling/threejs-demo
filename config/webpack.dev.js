/**
 * @author: @alin
 */
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
// const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'dev';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3004;
const PUBLIC = process.env.PUBLIC_DEV || undefined;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
    host: HOST,
    port: PORT,
    public: PUBLIC,
    ENV,
    HMR
});


// const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
    return webpackMerge(commonConfig({ env: ENV }), {
        devtool: 'cheap-module-source-map',
        output: {
            path: helpers.root('.tmp'),
            sourceMapFilename: '[file].map',
            // where to load chunk file
            filename: 'js/[name].[hash:5].js',
            chunkFilename: 'js/[name].[chunkhash].js',
            library: 'ac_[name]',
            libraryTarget: 'var',
        },

        module: {

            rules: [
                {
                    test: /\.less$/,
                    loader: 'style-loader!css-loader!postcss-loader!less-loader',
                }

            ]

        },

        plugins: [
            new DefinePlugin({
                ENV: JSON.stringify(METADATA.ENV),
                HMR: METADATA.HMR,
                'process.env': {
                    ENV: JSON.stringify(METADATA.ENV),
                    NODE_ENV: JSON.stringify(METADATA.ENV),
                    HMR: METADATA.HMR,
                }
            }),
            new WriteFilePlugin(),
            new LoaderOptionsPlugin({
                debug: true,
                options: {

                }
            }),

        ],
        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            public: METADATA.public,
            historyApiFallback: true,
            watchOptions: {
                ignored: /node_modules/
            },
            setup(app) {
            }
        },
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
}
