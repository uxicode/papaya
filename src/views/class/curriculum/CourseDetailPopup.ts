import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import PhotoViewer from '@/components/photoViewer/photoViewer.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import {IAttachFileModel} from '@/views/model/post.model';
import {ICurriculumDetailList} from '@/views/model/my-class.model';
import WithRender from './CourseDetailPopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        PhotoViewer,
        ImagePreview,
        FilePreview,
        ListInImgPreview,
        ListInFilePreview,
    }
})
export default class CourseDetailPopup extends Vue {

    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Number)
    private courseId!: number;

    @Prop(Object)
    private curriculumDetailItem!: ICurriculumDetailList;

    @Prop(Object)
    private courseDetailItem!: any;

    private isPhotoViewer: boolean = false;

    get curriculumDetailModel(): ICurriculumDetailList{
        return this.curriculumDetailItem;
    }

    get courseDetailModel(){
        return this.courseDetailItem;
    }

    private popupChange( value: boolean ) {
        this.$emit('close', value);
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private openPhotoViewer(): void {
        const attachment = this.courseDetailModel.attachment;
        if (this.getImgFileDataSort(attachment).length > 3) {
            this.isPhotoViewer = true;
        }

        console.log(attachment);
    }

    private onPhotoViewerStatus(value: boolean) {
        this.isPhotoViewer = value;
    }

}






