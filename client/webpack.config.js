const path = require('path');

module.exports =  env => {
  // Use env.<YOUR VARIABLE> here:
  // console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  // console.log('Production: ', env.production); // true
  return {
    mode: 'development',
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }, {
          test: /\.scss$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        }
      ]
    },
    resolve: {
      extensions: [ '.js']
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    }
  };
};
