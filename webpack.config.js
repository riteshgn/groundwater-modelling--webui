'use strict';

/**
 * If seeing a webpack config for the first time read this before proceeding
 * https://webpack.js.org/concepts/
 *
 * Excerpt from above link:
 * At its core, webpack is a static module bundler for modern JavaScript applications.
 * When webpack processes your application, it internally builds a dependency graph
 * which maps every module your project needs and generates one or more bundles.
 */

const webpack              = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');

//////////////////////////////////////////////////////////////////

module.exports = {
    // This is the entrypoint for the webpack module
    // Here we tell webpack that the starting point of our application-specific
    // javascript code is at client/src/app.js
    // We also tell webpack that we are using some external js libraries so that
    // webpack can bundle them for us.
    entry: {
        app: path.resolve(__dirname, 'client/src/app.js'),
        vendor: ['jquery', 'popper.js', 'bootstrap', 'mdbootstrap', 'plotly.js']
    },

    // Tells webpack to spit out the bundles based on the key names in the entry
    // configuration above. So in this case we it will generate app.js and vendor.js files
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js')
    },

    // By default webpack has a list of directories which under which it scans for vendor js code.
    // Generally, there are under node_modules/<vendor>/dist/js or something similar.
    // In below case we want to use the 'jquery', 'popper' and 'bootstrap' versions which are bundled
    // along with the 'mdbootstrap' package. So we tell webpack from where to resolve them.
    resolve: {
        alias: {
            'jquery$': 'mdbootstrap/js/jquery-3.3.1.min.js',
            'popper.js$': 'mdbootstrap/js/popper.min.js',
            'bootstrap$': 'mdbootstrap/js/bootstrap.min.js'
        }
    },

    // --> Configure Modules
    module: {
        // The rules module is used to tell webpack if any special processing is required for scanned files.
        // Files are matched using a 'test' regular expression and are fed to configured 'loaders'.
        // ES2015 script is used throughout the application js code. Webpack versions older than v4
        // required us to explicitly transpile them using 'babel-loader'. However since v4, such transpiling
        // comes out-of-the-box.
        rules: [

            // collect all css styles and bundle them
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // collect all fonts used in the css styles and cache them
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 50000,
                    mimetype: 'application/font-woff',
                    name: '../fonts/[name].[ext]',
                }
            },

            // collect all images used in the css styles and cache them
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 50000,
                    name: '../img/[name].[ext]',
                }
            }
        ]
    },
    // <-- Configure Modules

    // --> Additional plugins
    plugins: [

        // When webpack bundles our js code, some of the object (classic example is '$' from jQuery)
        // are encapsulated within function expressions and not accessible anymore.
        // The Provide Plugin allows to expose such global objects. We tell it the expected global name
        // and the corresponding module (see 'vendor' array in 'entry' config) which should be loaded.
        // ref: https://webpack.js.org/plugins/provide-plugin/
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
            Waves: 'node-waves',
            Plotly: 'plotly.js'
        }),

        // initialize the css extract plugin which helps pulls css styles into bundles.
        // ref: https://github.com/webpack-contrib/mini-css-extract-plugin
        new MiniCssExtractPlugin({
            filename: '../css/[name].css'
        })
    ],
    // <-- Additional plugins

    // --> Configure Optimizations
    optimization: {

        // helps spit out the bundles into chunks. the two chunks are
        // app.(js|css) and vendor.(js|css)
        // ref: https://webpack.js.org/plugins/split-chunks-plugin/
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                },

                styles: {
                    test: /\.css$/,
                    name: '[name].css',
                    chunks: 'all',
                    enforce: true
                }
            }
        }
        // <-- Split Chunks

    }
    // <-- Configure Optimizations
}