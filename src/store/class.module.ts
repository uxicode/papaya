import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {INullable} from '@/views/model/types';
import {IMyClassList, IPostList, IMakeClassInfo, IMakeClassInfoBase, IClassInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import {
    MYCLASS_LIST,
    POST_LIST,
    CREATE_CLASS_LIST,
    SET_CLASS_ID,
    SET_MYCLASS_HOME_DATA,
    REMOVE_CLASS_DATA,
    UPDATE_SIDE_MENU_NUM
} from '@/store/mutation-class-types';
import {
    MYCLASS_LIST_ACTION,
    POST_LIST_ACTION,
    MAKE_CLASS,
    MYCLASS_HOME,
    UPDATE_SIDE_MENU_NUM_ACTION
} from '@/store/action-class-types';


@Module({
    namespaced: true,
})
export default class ClassModule extends VuexModule {
    /* State */
    private classData: IMyClassList[]=[];
    private postData: IPostList[]=[];
    private count: number = 0;
    private classId: number = 0;
    private sideMenuNum: number=0;
    private myClassHomeData: IClassInfo={
        contents_updatedAt:new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        id:0,
        code: '',
        name:  '',
        owner_id: 0,
        owner_member_id:0,
        board_id:0,
        is_private: false,
        image_url: '',
        description: '',
        startday:0,
        endday:0,
        g_type:0,
        g_name:  '',
        g_code:  '',
        member_count: 0,
        question_showYN: false,
        deletedYN: false,
        contents_updated_type: 0,
        class_tags: [],
        class_link:  '',
    };

    private makeClassInfo: IMakeClassInfo={
        name:'',
        g_type:'',
        g_name: '',
        is_private: false,
        image_url:''
    };


    /* Getters */
    get myClassLists():  IMyClassList[]{
        return this.classData;
    }

    get createdClassInfo(): IMakeClassInfo {
        return this.makeClassInfo;
    }

    get classID(): string | null | number{
        return (  localStorage.getItem('classId') !==null )? localStorage.getItem('classId') : this.classId;
    }

    get myClassHomeModel(): IClassInfo {
        return (!this.myClassHomeData)? this.myClassHomeData : JSON.parse( localStorage.getItem('homeData') as string );
    }

    get activeSideMenuNum(): number{
        return (  localStorage.getItem('sideMenuNum') !==null )? Number( localStorage.getItem('sideMenuNum') ) : this.sideMenuNum;
    }

    @Mutation
    public [UPDATE_SIDE_MENU_NUM]( num: number ): void{
        this.sideMenuNum=num;
        console.log('sideMenuNum=', this.sideMenuNum);
        localStorage.setItem('sideMenuNum', String( num ) );
    }

    @Mutation
    public [SET_MYCLASS_HOME_DATA]( info: IClassInfo ): void{
        this.myClassHomeData=info;
        localStorage.setItem('homeData', JSON.stringify(this.myClassHomeData) );
    }

    /* Mutations */
    @Mutation
    public [SET_CLASS_ID]( id: number ): void {
        this.classId=id;
        localStorage.setItem('classId', String(this.classId) );
    }

    @Mutation
    public [CREATE_CLASS_LIST]( infos: IMakeClassInfo ): void {
        this.makeClassInfo = {...this.makeClassInfo, ...infos};
    }

    @Mutation
    public [MYCLASS_LIST](classData: IMyClassList[] ): void {
        this.classData =classData;

        // console.log(this.classData);
        localStorage.setItem('classData', JSON.stringify(this.classData) );
        this.count++;
    }

    @Mutation
    public [POST_LIST](postData: IPostList[] ): void {
        this.postData =postData;

        // console.log(this.postData);
        localStorage.setItem('postData', JSON.stringify(this.postData) );
        this.count++;
    }

    @Mutation
    public [REMOVE_CLASS_DATA](): void{
        console.log('클래스 데이터 제거');
        localStorage.removeItem('homeData');
        localStorage.removeItem('classData');
        localStorage.removeItem('classId');
        this.classData=[];
        this.postData=[];
        this.classId=0;
    }

    @Action({rawError: true})
    public [UPDATE_SIDE_MENU_NUM_ACTION]( num: number ): void{
        this.context.commit(UPDATE_SIDE_MENU_NUM, num);
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
        this.context.commit(UPDATE_SIDE_MENU_NUM, 0);

        return MyClassService.getClassInfoById( id )
          .then( (data)=>{
              this.context.commit(SET_MYCLASS_HOME_DATA, data.classinfo);

              console.log(this.myClassHomeModel);

              return Promise.resolve(this.myClassHomeModel);
          }).catch((error)=>{
              console.log(error);
              return Promise.reject(error);
          });


        // return this.$routers
    }
}
