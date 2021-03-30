import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import VueRouter from 'vue-router';
import {INullable} from '@/views/model/types';
import {IMyClassList, IPostList, IMakeClassInfo, IMakeClassInfoBase} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import {MYCLASS_LIST, POST_LIST, CREATE_CLASS_LIST, SET_CLASS_ID} from '@/store/mutation-class-types';
import {MYCLASS_LIST_ACTION, POST_LIST_ACTION, MAKE_CLASS, MYCLASS_HOME} from '@/store/action-class-types';
import {CLASS_BASE_URL} from '@/api/base';


@Module({
    namespaced: true,
})
export default class ClassModule extends VuexModule {
    /* State */
    private $classData: IMyClassList[]=[];
    private $postData: IPostList[]=[];
    private $count: number = 0;
    private $classID: string | number = 0;
    private $router: VueRouter =new VueRouter();

    private makeClassInfo: IMakeClassInfo={
        name:'',
        g_type:'',
        g_name: '',
        is_private: false,
        image_url:''
    };

    /* Getters */
    get myClassLists():  IMyClassList[]{
        return this.$classData;
    }

    get createdClassInfo(): IMakeClassInfo {
        return this.makeClassInfo;
    }

    get classID(): string | number{
        return this.$classID;
    }

    /* Mutations */
    @Mutation
    public [SET_CLASS_ID]( id: string | number ): void {
        this.$classID=id;
    }

    @Mutation
    public [CREATE_CLASS_LIST]( infos: IMakeClassInfo ): void {
        this.makeClassInfo = {...this.makeClassInfo, ...infos};
    }

    @Mutation
    public [MYCLASS_LIST](classData: IMyClassList[] ): void {
        this.$classData =classData;

        // console.log(this.classData);
        localStorage.setItem('classData', JSON.stringify(this.$classData) );
        this.$count++;
    }

    @Mutation
    public [POST_LIST](postData: IPostList[] ): void {
        this.$postData =postData;

        // console.log(this.postData);
        localStorage.setItem('postData', JSON.stringify(this.$postData) );
        this.$count++;
    }

    /* Actions */
    @Action({rawError: true})
    public [MYCLASS_LIST_ACTION](): Promise<INullable<IMyClassList[]>> {
        return MyClassService.getAllMyClass()
            .then((data: any) => {
                this.context.commit(MYCLASS_LIST, data.myclass_list);
                return Promise.resolve(data.myclass_list);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    @Action({rawError: true})
    public [POST_LIST_ACTION](): Promise<INullable<IPostList[]>> {
        return MyClassService.getMyKeepPosts()
            .then((data: any) => {
                this.context.commit(POST_LIST, data.post_list);
                return Promise.resolve(data.post_list);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    @Action({rawError: true})
    public [MAKE_CLASS]( infos: IMakeClassInfoBase ): Promise<IMakeClassInfo>{
        this.context.commit( CREATE_CLASS_LIST, infos );

        console.log(this.makeClassInfo);
        return MyClassService.setMakeClass( this.makeClassInfo )
          .then( (data: any)=>{
              console.log(data.classinfo);
              this.context.commit( CREATE_CLASS_LIST, this.makeClassInfo );
              return Promise.resolve(this.makeClassInfo);
          }).catch((error: any)=>{
              console.log(error);
              return Promise.reject(error);
          });
    }

    @Action({rawError: true})
    public [MYCLASS_HOME]( id: string | number ): Promise<any>{
        this.context.commit(SET_CLASS_ID, id);

        return MyClassService.getClassInfoById( id )
          .then( (data)=>{
              return Promise.resolve(data);
          }).catch((error)=>{
              console.log(error);
              return Promise.reject(error);
          });


        // return this.$routers
    }
}
