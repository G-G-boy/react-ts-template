import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { HotModuleReplacementPlugin } from 'webpack';
import commonConfig from "./webpack.common";

const devConfig = merge(commonConfig, {
    target: "web",
    mode: "development",
    plugins: [new HotModuleReplacementPlugin()],
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: resolve(__dirname, "./dist"),
        watchOptions: {
            ignored: /node_modules/
        },
        public: 'http://localhost:5000',
        host: '0.0.0.0',
        compress: true,
        hot: true,
        hotOnly: false,
        port: 5000,
        open: true,
        inline: true,
        historyApiFallback: true
    },
})

export default devConfig;