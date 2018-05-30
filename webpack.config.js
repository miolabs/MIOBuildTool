const prod = process.env.NODE_ENV === "prod";
const pjson = require('./package.json');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'dist/index.js',
        path: __dirname,
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    devtool: prod ? '' : 'inline-source-map',
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            'handlebars' : 'handlebars/dist/handlebars.js'
        }
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    optimization: {
        minimize: prod
    },
    plugins: [
    new webpack.BannerPlugin({ // add a banner to th start of the file with the current data and package.json version.
        banner: `hash: [hash] date: ${new Date()}, version: ${pjson.version}`
    })
    ],
    mode: prod ? "production": "development"
};