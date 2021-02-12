import Webpack from 'webpack';
import {Configuration as DevServerConfiguration} from 'webpack-dev-server';

type Configuration = Webpack.Configuration & {
    devServer?: DevServerConfiguration;
};
