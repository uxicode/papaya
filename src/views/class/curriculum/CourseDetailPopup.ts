import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import WithRender from './CourseDetailPopup.html';
import {ICourseData, ICurriculumList, IMyClassList} from '@/views/model/my-class.model';
import {IAttachFileModel} from '@/views/model/post.model';

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
export default class CourseDetailPopup extends Vue {

    @Prop(Boolean)
    private isOpen!: boolean;

    @MyClass.Getter
    private curriculumDetailItem!: ICurriculumList;

    @MyClass.Getter
    private courseDetailItem!: ICourseData;

    private testData: any = {};

    get curriculumDetailModel(): ICurriculumList{
        return this.curriculumDetailItem;
    }

    get curriculumDetailArray(): any {
        return this.curriculumDetailItem.curriculum.course_list;
    }

    get courseDetailModel(){
        return this.courseDetailItem;
    }

    private getCourseAttachmentData(courseId: number){
        const test1 = this.courseDetailItem.course.id;
        const test2 = this.curriculumDetailArray;

        test2.find((item: any) => item.id === test1);

        console.log(test1, test2);
    }


    private popupChange( value: boolean ) {
        this.$emit('close', value);
    }


}






