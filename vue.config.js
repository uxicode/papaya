const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
//http://211.254.212.184:8089/api/v1
const target = 'http://localhost:3000';
module.exports={
    devServer:{
        port:8080,
        proxy:{
            '^/v1':{
                target,
                changeOrigin:true
            }
        },
        historyApiFallback: true,
    },
    // productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugin("fork-ts-checker").tap((args) => {
            args[0].memoryLimit = 512;
            return args;
        });
    },
    configureWebpack:{
        module:{
            rules:[
                {
                    test:/.html$/,
                    loader:"vue-template-loader",
                    exclude:/index.html/
                },
                /*{
                    test: /\.(png|jpg|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                esModule: false,
                                name: '[name].[ext]?[hash]',
                                publicPath: './dist/',
                                limit: 4096,
                            },
                        },
                    ],
                }*//*,
                */
            ]
        },
        plugins: [new BundleAnalyzerPlugin(), new VuetifyLoaderPlugin({
            /**
             * This function will be called for every tag used in each vue component
             * It should return an array, the first element will be inserted into the
             * components array, the second should be a corresponding import
             *
             * originalTag - the tag as it was originally used in the template
             * kebabTag    - the tag normalized to kebab-case
             * camelTag    - the tag normalized to PascalCase
             * path        - a relative path to the current .vue file
             * component   - a parsed representation of the current component
             */
            match (originalTag, { kebabTag, camelTag, path, component }) {
                if (kebabTag.startsWith('core-')) {
                    return [
                        camelTag,
                        `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`
                    ]
                }
            }
        })]
    },
    css:{
        loaderOptions: {
            postcss: {
                ident: 'postcss',
                plugins: [ require('autoprefixer')]
            }
        }
    }
    /* ,
    css: {
        loaderOptions: {
            scss: {
                prependData:`
                @import "@/assets/scss/common.scss";
                @import "@/assets/scss/pages.scss";
                `
            }
        }
    }
    //??? ????????? ?????? ?????????????????? ???????????? ???????????? css class ??? ????????? ?????? ????????? ???????????????.
   //?????? ????????? ?????? ??????????????? ????????? ????????? ????????? SCSS??? ????????? ?????? ????????? ??????????????? ???????????? ???????????????
   // ???????????? ?????? (router-view?????? ???????????? ????????? ?????? ??????????????? ??????????????? ?????? ???) ??????
    //?????? ??????????????? ???????????? ?????? ???????????? ???????????? ??????.
    */
}
