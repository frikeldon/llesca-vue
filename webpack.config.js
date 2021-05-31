import path from 'path'
import { readFile } from 'fs/promises'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default async () => {
  const packageJson = JSON.parse(await readFile('./package.json'))

  return {
    mode: 'production',
    entry: './index.umd.js',
    output: {
      path: path.resolve('dist'),
      library: {
        name: 'llescaVue',
        type: 'umd',
        export: 'default'
      },
      filename: 'llesca-vue.js'
    },
    externals: {
      vue: 'Vue'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.less$/,
          oneOf: [{
            resourceQuery: /module/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: { modules: true }
              },
              'less-loader'
            ]
          }, {
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: { esModule: false }
              },
              'less-loader'
            ]
          }]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'llesca-vue.css'
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(packageJson.version)
      })
    ]
  }
}
