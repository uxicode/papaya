module.exports={
    productionSourceMap: false,
    configureWebpack:{
        module:{
            rules:[
                {
                    test:/.html$/,
                    loader:"vue-template-loader",
                    exclude:/index.html/
                }
            ]
        }
    },
    css: {
        loaderOptions: {
            scss: {
                prependData:`@import "@/assets/scss/common.scss";`
            }
        }
    }
}
