import ClassMemberService from '@/api/service/ClassMemberService';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {INullable} from '@/views/model/types';
import {
    IMyClassList,
    IMakeClassInfo,
    IMakeClassInfoBase,
    IClassInfo,
    IClassMemberInfo, IKeepPostList, ICurriculumList, ICourseData,
} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import {
    MYCLASS_LIST,
    KEEP_POST_LIST,
    CREATE_CLASS_LIST,
    SET_CLASS_ID,
    SET_MYCLASS_HOME_DATA,
    REMOVE_CLASS_DATA,
    CLASS_MEMBER_INFO,
    SET_MEMBER_ID,
    UPDATE_SIDE_NUM,
    SET_CURRICULUM_DETAIL,
    SET_COURSE_DETAIL
} from '@/store/mutation-class-types';
import {
    MYCLASS_LIST_ACTION,
    KEEP_POST_LIST_ACTION,
    MAKE_CLASS,
    MYCLASS_HOME,
    CLASS_MEMBER_INFO_ACTION,
    MODIFY_CLASS_MEMBER_INFO,
    GET_CURRICULUM_DETAIL_ACTION,
    GET_COURSE_DETAIL_ACTION
} from '@/store/action-class-types';
import {PostService} from '@/api/service/PostService';

@Module({
    namespaced: true,
})
export default class ClassModule extends VuexModule {
    /* State */
    private classData: IMyClassList[]=[];
    private keepPostItems: IKeepPostList[]=[];
    private memberInfo: IClassMemberInfo[] = [];
    private count: number = 0;
    private classIdx: number = -1;
    private sideMenuNum: number=0;
    private memberId: string | number = 0;
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
        me: {
            class_id: 744,
            createdAt: new Date(),
            id: 825,
            is_bookmarked: 0,
            joinedAt: new Date(),
            level: 1,
            nickname: '홍길동1',
            onoff_comment_noti: 1,
            onoff_post_noti: 1,
            onoff_push_noti: 0,
            onoff_schedule_noti: 1,
            open_level_email: 2,
            open_level_id: 1,
            open_level_mobileno: 0,
            profile_image: null,
            schedule_color: 0,
            schedule_noti_intime: 10,
            status: 1,
            updatedAt: new Date(),
            user_id: 45,
            visited: 0
        }
    };
    private curriculumDetailData: ICurriculumList={
        curriculum: {
            startAt: '2019-11-17 10:00:00',
            endAt: '2019-11-17 10:00:00',
            expiredAt: '2019-11-17 10:00:00',
            createdAt: '2019-11-17 10:00:00',
            updatedAt: '2019-11-17 10:00:00',
            id: 0,
            class_id: 0,
            board_id: 0,
            post_type: 0,
            type: 0,
            user_id: 0,
            user_member_id: 0,
            title: '',
            text: '',
            count: 0,
            param1: 0,
            deletedYN: false,
            owner: {
                nickname: '',
                level: 0,
            },
            course_list: [
                {
                    startDay: '2019-11-17',
                    createdAt: '2019-11-17',
                    updatedAt: '2019-11-17',
                    id: 0,
                    curriculum_id: 0,
                    class_id: 0,
                    index: 0,
                    title: '',
                    contents: '',
                    startTime: '2019-11-17',
                    endTime: '2019-11-17',
                    deletedYN: false,
                    attachment: [],
                },
            ],
        }
    };

    private courseDetailData: ICourseData = {
        course: {
            startDay: '2019-11-17 10:00:00',
            createdAt: '2019-11-17 10:00:00',
            updatedAt: '2019-11-17 10:00:00',
            id: 0,
            curriculum_id: 0,
            class_id: 0,
            index: 0,
            title: '',
            contents: '',
            startTime: '10:00:00',
            endTime: '10:00:00',
        }
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

    get classID(): number {
        return this.classIdx;
    }

    get curriculumDetailItem(): ICurriculumList{
        return this.curriculumDetailData;
    }

    /**
     * 클래스 홈 ( 클래스 리스트 상세 내역 ) 데이터
     */
    get myClassHomeModel(): IClassInfo {
        return this.myClassHomeData;
    }

    get sideNumModel(): number {
        return this.sideMenuNum;
    }

    /* Mutations */
    @Mutation
    public [UPDATE_SIDE_NUM](num: number): void{
        this.sideMenuNum=num;
    }


    @Mutation
    public [SET_MYCLASS_HOME_DATA]( info: IClassInfo ): void{
        this.myClassHomeData=info;
        localStorage.setItem('homeData', JSON.stringify(this.myClassHomeData) );
    }

    @Mutation
    public [SET_CURRICULUM_DETAIL]( data: any ){
        this.curriculumDetailData=data;
    }

    @Mutation
    public [SET_COURSE_DETAIL]( data: any ){
        this.courseDetailData=data;
    }

    /**
     * classId  변경 시킴
     * @param id
     */
    @Mutation
    public [SET_CLASS_ID]( id: number  ): void {
        this.classIdx=Number( id );
        // console.log('this.classIdx', this.classIdx );
        localStorage.setItem('classId', String( this.classIdx ) );
    }

    @Mutation
    public [CREATE_CLASS_LIST]( infos: IMakeClassInfo ): void {
        this.makeClassInfo = {...this.makeClassInfo, ...infos};
    }

    @Mutation
    public [MYCLASS_LIST](classData: IMyClassList[] ): void {
        this.classData =classData;

        // console.log(this.classData);
        // localStorage.setItem('classData', JSON.stringify(this.classData) );
        this.count++;
    }

    @Mutation
    public [KEEP_POST_LIST](postData: IKeepPostList[] ): void {
        this.keepPostItems =postData;
        // localStorage.setItem('postData', JSON.stringify(this.postData) );
        // this.count++;
    }

    @Mutation
    public [SET_MEMBER_ID](memberId: number): void {
        this.memberId = memberId;
    }

    @Mutation
    public [CLASS_MEMBER_INFO](memberInfo: IClassMemberInfo[] ): void {
        this.memberInfo = memberInfo;
        //localStorage.setItem('memberInfo', JSON.stringify(this.memberInfo) );
    }

    /**
     * 클래스 데이터 제거
     */
    @Mutation
    public [REMOVE_CLASS_DATA](): void{
        // console.log('클래스 데이터 제거');
        localStorage.removeItem('homeData');
        // localStorage.removeItem('classData');
        localStorage.removeItem('classId');
        this.classData=[];
        this.keepPostItems=[];
        this.classIdx=-1;
    }

    /* Actions */
    @Action({rawError: true})
    public [MYCLASS_LIST_ACTION](): Promise<IMyClassList[]> {
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
    public [KEEP_POST_LIST_ACTION](): Promise<IKeepPostList[]> {
        return PostService.getMyKeepPosts()
            .then((data: any) => {
                this.context.commit(KEEP_POST_LIST, data.post_list);
                return Promise.resolve(data.post_list);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    @Action({rawError: true})
    public [MAKE_CLASS]( infos: IMakeClassInfoBase ): Promise<IMakeClassInfo>{
        this.context.commit( CREATE_CLASS_LIST, infos );

        // console.log(this.makeClassInfo);
        return MyClassService.setMakeClass( this.makeClassInfo )
          .then( (data: any)=>{
              // console.log(data.classinfo);
              this.context.commit( CREATE_CLASS_LIST, this.makeClassInfo );
              return Promise.resolve(this.makeClassInfo);
          }).catch((error: any)=>{
              console.log(error);
              return Promise.reject(error);
          });
    }

    /**
     * 클래스 상세 내역 가져오기
     * @param id
     */
    @Action({rawError: true})
    public [MYCLASS_HOME]( id: string | number ): Promise<any>{
        this.context.commit(SET_CLASS_ID, id);
        return MyClassService.getClassInfoById( id )
          .then( (data)=>{
              this.context.commit(SET_MYCLASS_HOME_DATA, data.classinfo);
              // console.log('통신 후 vuex MYCLASS_HOME=', this.classID, '::리스트 클릭 id=', id, this.classIdx );
              return Promise.resolve(this.myClassHomeModel);
          }).catch((error)=>{
              console.log(error);
              return Promise.reject(error);
          });


        // return this.$routers
    }

    @Action({rawError: true})
    public [CLASS_MEMBER_INFO_ACTION](payload: { classId: number, memberId: number }): Promise<IClassMemberInfo[]>{

        return ClassMemberService.getClassMemberInfo(payload.classId, payload.memberId)
          .then((data) => {
              this.context.commit(SET_MEMBER_ID, payload.memberId);
              this.context.commit(CLASS_MEMBER_INFO, data);
              // console.log(this.memberInfo);
              return Promise.resolve(this.memberInfo);
          })
          .catch((error) => {
              console.log(error);
              return Promise.reject(error);
          });
    }

    @Action({rawError: true})
    public [MODIFY_CLASS_MEMBER_INFO](payload: {classId: number, memberId: number}, data: object): Promise<IClassMemberInfo[]>{
        //this.context.commit(SET_CLASS_ID, payload.classId);

        return ClassMemberService.setClassMemberInfo(payload.classId, payload.memberId, data)
          .then((info) => {
              this.context.commit(SET_MEMBER_ID, payload.memberId);
              this.context.commit(CLASS_MEMBER_INFO, info);
              console.log(this.memberInfo);
              return Promise.resolve(this.memberInfo);
          })
          .catch((error) => {
              console.log(error);
              return Promise.reject(error);
          });
    }



    @Action
    public [GET_CURRICULUM_DETAIL_ACTION](payload: { classId: number, curriculumId: number}): Promise<any>{
        return MyClassService.getEduCurList(payload.classId, payload.curriculumId )
            .then((data) => {
                this.context.commit(SET_CURRICULUM_DETAIL, data);
                console.log('curriculumDetailData=', this.curriculumDetailData);
                return Promise.resolve(this.curriculumDetailData);
            }).catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    @Action
    public [GET_COURSE_DETAIL_ACTION](payload: { classId: number, curriculumId: number, courseId: number }): Promise<any>{
        return MyClassService.getEduCourseList(payload.classId, payload.curriculumId, payload.courseId )
            .then((data) => {
                this.context.commit(SET_COURSE_DETAIL, data);
                console.log('courseDetailData=', this.courseDetailData);
                return Promise.resolve(this.courseDetailData);
            }).catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

}
