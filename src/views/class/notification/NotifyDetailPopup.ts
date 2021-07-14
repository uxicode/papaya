import {Vue, Component, Prop, Mixins} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import PhotoViewer from '@/components/photoViewer/photoViewer.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import DetailInVotePreview from '@/components/preview/DetailInVotePreview.vue';
import CommentArea from '@/components/comment/CommentArea.vue';
import CommentBtm from '@/components/comment/CommentBtm.vue';
import WithRender from './NotifyDetailPopup.html';
import UtilsMixins from '@/mixin/UtilsMixins';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        PhotoViewer,
        ListInImgPreview,
        ListInFilePreview,
        ListInLinkPreview,
        DetailInVotePreview,
        CommentArea,
        CommentBtm,
    }
})
export default class NotifyDetailPopup extends Mixins(UtilsMixins) {

    @Prop(Boolean)
    private isOpen!: boolean;

    @Post.Getter
    private postDetailItem!: IPostModel & IPostInLinkModel;

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private isPhotoViewer: boolean = false;

    get postDetailModel():  IPostModel & IPostInLinkModel{
        return this.postDetailItem;
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

/*    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }*/

    private openPhotoViewer(): void {
        const attachment = this.postDetailModel.attachment;
        if (this.imgPreviewInit(attachment).length > 3) {
            this.isPhotoViewer = true;
        }
    }

    private onPhotoViewerStatus(value: boolean) {
        this.isPhotoViewer = value;
    }

}
