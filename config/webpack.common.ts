import Webpack from 'webpack/types';
import {resolve} from 'path';
import WebpackBarPlugin from 'webpackbar';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {Options as HtmlMinifierOptions} from 'html-minifier';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {loader as MiniCssExtractLoader} from 'mini-css-extract-plugin';
import {HMR_PATH} from '../scripts/middlewares/webpack-middleware';

const isDev = process.env.NODE_ENV !== 'production';

const htmlMinifyOptions: HtmlMinifierOptions = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    useShortDoctype: true,
};

const commonConfig: Webpack.Configuration = {
    cache: true,
    context: resolve(__dirname, '../'),
    entry: [resolve(__dirname, '../src/index.tsx')],
    output: {
        publicPath: '/',
        path: resolve(__dirname, '../dist'),
        filename: 'js/[name]-[hash].bundle.js',
        hashSalt: 'react-ts-template',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.scss'],
        alias: {
            '@': resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: true,
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true},
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true},
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10 * 1024,
                            name: '[name].[contenthash].[ext]',
                            outputPath: 'images',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[contenthash].[ext]',
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new WebpackBarPlugin({
            name: 'react-ts-template',
            color: '#61dafb', //react color
        }),
        new FriendlyErrorsPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: isDev ? false : htmlMinifyOptions,
            template: resolve(__dirname, '../public/index.html'),
            templateParameters: (...args: any[]) => {
                const [compilation, assets, assetTags, options] = args;
                const rawPublicPath = commonConfig.output!.publicPath! as string;
                return {
                    compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        tags: assetTags,
                        files: assets,
                        options,
                    },
                    PUBLIC_PATH: rawPublicPath.endsWith('/')
                        ? rawPublicPath.slice(0, -1)
                        : rawPublicPath,
                };
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: resolve(__dirname, '../public'),
                    from: '*',
                    to: resolve(__dirname, '../dist'),
                    toType: 'dir',
                    filter: (resourcePath) => {
                        return !resourcePath.includes('index.html');
                    },
                },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: isDev ? 1024 : 2048,
                configFile: resolve(__dirname, '../tsconfig.json'),
            },
        }),
    ],
};

if (isDev) {
    (commonConfig.entry as string[]).unshift(
        `webpack-hot-middleware/client?path=${HMR_PATH}&reload=true&overlay=true`,
    );
}

export default commonConfig;
