import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { HotModuleReplacementPlugin } from 'webpack';

import commonConfig from "./webpack.common";

const devConfig = merge(commonConfig, {
    mode: "development",
    plugins: [
        new HotModuleReplacementPlugin(),
    ],
    devtool: 'eval-source-map',
    devServer: {
        contentBase: resolve(__dirname, "./dist"),
        watchOptions: {
            ignored: /node_modules/
        },
        public: 'http://localhost:5000',
        host: '0.0.0.0',
        compress: true,
        hot: true,
        port: 5000,
        open: true,
        historyApiFallback: true
    },
})

export default devConfig;