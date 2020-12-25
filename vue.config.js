const path = require('path');
const resolve = function(dir) {
  return path.join(__dirname, dir);
};
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true, // 是否开启eslint保存检测
  productionSourceMap: process.env.NODE_ENV !== 'production', // 是否在构建生产包时生成sourcdeMap
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass') // This line must in sass option
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@v', resolve('src/views'))
      .set('@c', resolve('src/components'))
      .set('@u', resolve('src/utils'))
      .set('@s', resolve('src/service')); /* 别名配置 */
    config.optimization.runtimeChunk('single');
  },
  devServer: {
    host: '0.0.0.0', //局域网和本地访问
    port: 9587,
    hot: true,
    /* 自动打开浏览器 */
    open: false,
    overlay: {
      warning: false,
      error: true
    },
    /* 跨域代理 */
    proxy: {
      '/api': {
        /* 目标代理服务器地址 */
        target: 'http://localhost:3000', //
        /* 允许跨域 */
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
