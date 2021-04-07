const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
module.exports={
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
                }
                /*{
                    test: /\.(png|jpg|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                esModule: false,
                            },
                        },
                    ],
                }*/
            ]
        },
        plugins: [new BundleAnalyzerPlugin(), new VuetifyLoaderPlugin()]
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
    //위 코드는 어떤 컴포넌트에서 로컬에서 사용되는 css class 가 있다면 해당 부분만 로드시킨다.
   //위의 코드는 모든 컴포넌트의 스타일 태그에 지정한 SCSS의 코드를 넣는 처리가 수행되므로 참조하는 컴포넌트가
   // 여러개인 경우 (router-view등을 사용하여 수많은 자식 컴포넌트를 임포트하는 경우 등) 에는
    //자식 컴포넌트의 개수만큼 같은 스타일이 중복되어 적용.
    */
}
