import * as webpack from "webpack";
import * as path from "path";
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
    entry: [
        "react-hot-loader/patch",
        "./src/index.tsx",
        "./src/style.less",
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js",
    },
    devtool: "source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".less"]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Medicious',
            chunksSortMode: 'dependency',
            template: path.resolve(__dirname, './src/index.ejs')
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: [
                    "react-hot-loader/webpack",
                    "awesome-typescript-loader"
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, "src"),
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.less$/,
                loaders: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ],
            },
        ]
    },
    devServer: {
        hot: true
    }
};

export default config;
