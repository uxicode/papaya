import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import CourseDetailPopup from '@/views/class/curriculum/CourseDetailPopup';
import {
    IClassInfo,
    ICurriculumDetailList,
} from '@/views/model/my-class.model';
import WithRender from './CurriculumDetailPopup.html';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import {IAttachFileModel, IVoteModel} from '@/views/model/post.model';

const MyClass = namespace('MyClass');


@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        CourseDetailPopup
    }
})
export default class CurriculumDetailPopup extends Vue {
    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Number)
    private curriculumId!: number;

    @Prop(Object)
    private curriculumDetailItem!: ICurriculumDetailList;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;



    @MyClass.Action
    private GET_COURSE_DETAIL_ACTION!: ( payload: { classId: number, curriculumId: number, courseId: number }) =>Promise<any>;

    private courseId: number = 0;

    private isOpenCourseDetailPopup: boolean = false;
    private detailCurriculumId: number=-1; // 동적으로 변경 안되는 상태

    private courseDetailItem: any = {};

    private isOwner( ownerId: number, userId: number): boolean {
        return (ownerId === userId);
    }

    private getProfileImg(imgUrl: string | null | undefined ): string{
        return ImageSettingService.getProfileImg( imgUrl );
    }

    private getImgFileLen( items: IAttachFileModel[] ): number{
        return (items) ? this.getImgFileDataSort( items ).length : 0;
    }

    private getFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter( (item: IAttachFileModel) => item.contentType !== 'image/png' && item.contentType !== 'image/jpg' && item.contentType !== 'image/jpeg' && item.contentType !== 'image/gif');
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

    get curriculumDetailModel(): ICurriculumDetailList{
        return this.curriculumDetailItem;
    }


    get courseDetailData(): any {
        return this.curriculumDetailItem.course_list;
    }


    private onCourseDetailPopupClose(value: boolean ) {
        this.isOpenCourseDetailPopup=value;
    }

    private async onDetailCourseOpen(curriculumId: number, courseId: number) {
        this.detailCurriculumId = curriculumId;
        this.courseId = courseId;

        const targetData = this.courseDetailData;

        console.log(`test`,targetData);

        this.courseDetailItem = targetData.find((item: any) => item.id === this.courseId);

        await this.GET_COURSE_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.detailCurriculumId, courseId: this.courseId})
            .then((data)=>{
                this.isOpenCourseDetailPopup=true;
            });
    }
}






