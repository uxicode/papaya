import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    IMakeEducation,
    IEducationList,
    ICurriculumList,
    IModifyCurriculum,
} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import WithRender from './CurriculumDetailPopup.html';

const MyClass = namespace('MyClass');



@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        ImagePreview,
        FilePreview,
        ListInImgPreview,
        ListInFilePreview,
    }
})
export default class CurriculumDetailPopup extends Vue {
    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Number)
    private curriculumId!: number;

    @Prop(Number)
    private detailCurriculumId!: number;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* Modal 오픈 상태값 */

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];
    private EduSettingsModel: string = '교육과정 수정';

    private imgFileURLItems: string[] = [];

    private allEduList: IEducationList[]= [];

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

    get curriculumDetailModel():  ICurriculumList{
        return this.curriculumDetailData;
    }

    get imgFileURLItemsModel(): string[] {
        return this.imgFileURLItems;
    }

    public created(){
        // this.settingItems=this.mItemByMakeEduList();
        this.getEduList();
    }

    public reset() {
        this.curriculumDetailData = {
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
    }

    private getProfileImg(imgUrl: string | null | undefined ): string{
        return ImageSettingService.getProfileImg( imgUrl );
    }

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }


    private isOwner( ownerId: number, userId: number): boolean {
        return (ownerId === userId);
    }

    private getImgFileLen( items: IAttachFileModel[] ): number{
        return (items) ? this.getImgFileDataSort( items ).length : 0;
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private getFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter( (item: IAttachFileModel) => item.contentType !== 'image/png' && item.contentType !== 'image/jpg' && item.contentType !== 'image/jpeg' && item.contentType !== 'image/gif');
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
        console.log(this.detailCurriculumId);
    }



    /**
     * 클래스 교육과정 전체 조회
     */

    private getEduList(): void {
        MyClassService.getEducationList(this.classID)
            .then((data) => {
                this.allEduList = data;
                // console.log(this.allEduList);
            });
    }

    /**
     * 클래스 교육과정 정보 조회
     */
    // get curriculumList(): ICurriculumList{
    //     return this.curriculumDetailData;
    // }

    private getCurrItemTitleById( title: string): string {
        return (title)? title : '';
    }

    /**
     * 교육과정 정보 가져오기
     * @private
     */
    private getDetailCurriculum( curriculumId: number ): void {
        MyClassService.getEduCurList(this.classID, curriculumId )
            .then((data) => {
                this.curriculumDetailData = data;
                console.log(`test1`, this.curriculumDetailData);
                console.log(`test2`, data);
            });
    }



}






