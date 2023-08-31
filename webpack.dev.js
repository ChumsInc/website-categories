const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path')

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: [
            {
                directory: path.join(process.cwd(), 'public'),
                watch: false,
            }, {
                directory: path.join(process.cwd(), 'node_modules'),
                publicPath: '/node_modules',
                watch: false,
            }, {
                directory: path.join(process.cwd()),
                watch: false,
            }
        ],
        hot: true,
        proxy: {
            '/api': {...localProxy},
            '/node-dev/': {...localProxy},
            '/node-sage/': {...localProxy},
            '/sage/': {...localProxy},
        },
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: []
});
