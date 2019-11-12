module.exports = {
    devServer: {
        proxy: {
            '^/api': {
              target: process.env.VUE_APP_API_BASEURL,
              ws: true,
              changeOrigin: true
            }
          }
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
    ,
    chainWebpack(config){
      config.module.rule('md')
        .test(/\.md/)
        .use('vue-loader')
        .loader('vue-loader')
        .end()
        .use('vue-markdown-loader')
        .loader('vue-markdown-loader/lib/markdown-compiler')
        .options({
          raw: true
        })
    }
}