import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import PhotoViewer from '@/views/class/notification/PhotoViewer';
import DetailInVotePreview from '@/components/preview/DetailInVotePreview.vue';
import WithRender from './NotifyDetailPopup.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        ListInImgPreview,
        ListInFilePreview,
        ListInLinkPreview,
        PhotoViewer,
        DetailInVotePreview,
    }
})
export default class NotifyDetailPopup extends Vue {

    @Prop(Boolean)
    private isOpen!: boolean;


    @Post.Getter
    private postDetailItem!: IPostModel & IPostInLinkModel;

    @Post.Getter
    private commentItems!: any[];

    @Post.Getter
    private replyItems!: any[];

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private isPhotoViewer: boolean = false;

    get commentItemsModel() {
        return this.commentItems;
    }

    get replyItemsModel() {
        return this.replyItems;
    }

    get postDetailModel():  IPostModel & IPostInLinkModel{
        return this.postDetailItem;
    }

    private updatedDiffDate( dateValue: Date ): string{
        return Utils.updatedDiffDate(dateValue);
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private openPhotoViewer(): void {
        const attachment = this.postDetailModel.attachment;
        if (this.getImgFileDataSort(attachment).length > 3) {
            this.isPhotoViewer = true;
        }
    }

    private onPhotoViewerStatus(value: boolean) {
        this.isPhotoViewer = value;
    }

}
