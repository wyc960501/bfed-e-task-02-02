const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config =  {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'js/bundle.[contenthash:6].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'img/[name].[contenthash:6].[ext]',
                        esModule: false,
                        limit: 5 * 1024 // kb
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: 'Vue App'
        }),
        new webpack.DefinePlugin({
            BASE_URL: '"/"'
        })
    ]
}

module.exports = config
