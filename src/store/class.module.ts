import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {INullable} from '@/views/model/types';
import {
    IMyClassList,
    IPostList,
    IMakeClassInfo,
    IMakeClassInfoBase,
    IClassInfo,
    IClassMemberInfo, IQuestionList
} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import {
    MYCLASS_LIST, POST_LIST,
    CREATE_CLASS_LIST, SET_CLASS_ID,
    SET_MYCLASS_HOME_DATA, REMOVE_CLASS_DATA,
    CLASS_MEMBER_INFO, SET_MEMBER_ID, SET_QUESTION_ID, UPDATE_SIDE_MENU_NUM
} from '@/store/mutation-class-types';
import {
    MYCLASS_LIST_ACTION,
    POST_LIST_ACTION,
    MAKE_CLASS,
    MYCLASS_HOME,
    CLASS_MEMBER_INFO_ACTION,
    MODIFY_CLASS_MEMBER_INFO,
    MODIFY_CLASS_INFO,
    MODIFY_QUESTION,
    UPDATE_SIDE_MENU_NUM_ACTION
} from '@/store/action-class-types';


@Module({
    namespaced: true,
})
export default class ClassModule extends VuexModule {
    /* State */
    private classData: IMyClassList[]=[];
    private postData: IPostList[]=[];
    private memberInfo: IClassMemberInfo[] = [];
    private questionData: IQuestionList[] = [];
    private count: number = 0;
    private classId: number = 0;
    private sideMenuNum: number=0;
    private memberId: number = 0;
    private questionId: number = 0;
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

    get memberID(): string | null | number{
        return (  localStorage.getItem('memberId') !==null )? localStorage.getItem('memberId') : this.memberId;
    }

    get questionID(): string | null | number{
        return (  localStorage.getItem('questionId') !==null )? localStorage.getItem('questionId') : this.questionId;
    }

    /* Mutations */

    @Mutation
    public [SET_MYCLASS_HOME_DATA]( info: IClassInfo ): void{
        this.myClassHomeData=info;
        localStorage.setItem('homeData', JSON.stringify(this.myClassHomeData) );
    }


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
    public [SET_MEMBER_ID](memberId: number): void {
        this.memberId = memberId;
        localStorage.setItem('memberId', String(this.memberId) );
    }

    @Mutation
    public [CLASS_MEMBER_INFO](memberInfo: IClassMemberInfo[] ): void {
        this.memberInfo = memberInfo;

        localStorage.setItem('memberInfo', JSON.stringify(this.memberInfo) );
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

    @Mutation
    public [SET_QUESTION_ID](questionId: number): void {
        this.questionId = questionId;
        localStorage.setItem('questionId', String(this.questionId) );
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

    @Action({rawError: true})
    public [CLASS_MEMBER_INFO_ACTION](payload: { classId: number, memberId: number }): Promise<IClassMemberInfo[]>{
        this.context.commit(SET_CLASS_ID, payload.classId);
        this.context.commit(SET_MEMBER_ID, payload.memberId);

        return MyClassService.getClassMemberInfo(payload.classId, payload.memberId)
          .then((data) => {
              this.context.commit(CLASS_MEMBER_INFO, data.member_info);
              console.log(this.memberInfo);
              return Promise.resolve(this.memberInfo);
          })
          .catch((error) => {
              console.log(error);
              return Promise.reject(error);
          });
    }

    @Action({rawError: true})
    public [MODIFY_CLASS_MEMBER_INFO](payload: {classId: number, memberId: number}, data: object): Promise<IClassMemberInfo[]>{
        this.context.commit(SET_CLASS_ID, payload.classId);
        this.context.commit(SET_MEMBER_ID, payload.memberId);

        return MyClassService.setClassMemberInfo(payload.classId, payload.memberId, data)
          .then((info) => {
              this.context.commit(CLASS_MEMBER_INFO, info);
              console.log(this.memberInfo);
              return Promise.resolve(this.memberInfo);
          })
          .catch((error) => {
              console.log(error);
              return Promise.reject(error);
          });
    }

    @Action({rawError: true})
    public [MODIFY_QUESTION](payload: {classId: number, questionId: number}, text: {new_question: string}): Promise<any>{
        this.context.commit(SET_CLASS_ID, payload.classId);
        this.context.commit(SET_QUESTION_ID, payload.questionId);

        return MyClassService.setClassQuestion(payload.classId, payload.questionId, text)
          .then((success) => {
            console.log(success);
            return Promise.resolve(this.questionData);
          })
          .catch((error) => {
              console.log(error);
              return Promise.reject(error);
          });
    }
}
