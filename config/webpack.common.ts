import { Configuration } from 'webpack';
import {resolve} from "path";
import WebpackBarPlugin from "webpackbar";
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options as HtmlMinifierOptions } from 'html-minifier';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

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

const commonConfig: Configuration = {
    cache: true,
    context: resolve(__dirname, '../'),
    entry: resolve(__dirname, '../src/index.tsx'),
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
                options: {cacheDirectory: true},
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
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
                        options: { sourceMap: true },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
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
                        options: { sourceMap: true },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new WebpackBarPlugin({
            name: 'react-ts-template',
            color: "#61dafb", //react color
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
        new CopyPlugin({patterns: [{
                context: resolve(__dirname, '../public'),
                from: '*',
                to: resolve(__dirname, '../dist'),
                toType: 'dir',
                // filter: resourcePath => {
                //     return !resourcePath.includes('index.html');
                // }
            },]}),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: isDev ? 1024 : 2048,
                configFile: resolve(__dirname, '../tsconfig.json')
            }
        }),
    ]
}

export default commonConfig;