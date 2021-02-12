import {resolve} from 'path';
import {merge} from 'webpack-merge';
import {HotModuleReplacementPlugin, NoEmitOnErrorsPlugin} from 'webpack';
import commonConfig from './webpack.common';
import {Configuration} from './typings';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const devConfig = merge<Configuration>(commonConfig, {
    target: 'web',
    mode: 'development',
    plugins: [
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new NoEmitOnErrorsPlugin(),
    ],
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: resolve(__dirname, './dist'),
        watchOptions: {
            ignored: /node_modules/,
        },
        public: 'http://localhost:5000',
        host: '0.0.0.0',
        compress: true,
        hot: true,
        hotOnly: true,
        port: 5000,
        open: true,
        inline: true,
        historyApiFallback: true,
    },
});

export default devConfig;
