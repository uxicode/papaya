import {Vue, Component, Prop} from 'vue-property-decorator';
import {IAttachFileModel} from '@/views/model/post.model';
import WithRender from './PhotoViewer.html';

@Component
@WithRender
export default class PhotoViewer extends Vue {

    @Prop(Boolean)
    private isPhotoViewer!: boolean;

    @Prop(Array)
    private imgData!: IAttachFileModel[];

    private activeNum: number = 0;

    private showPrevImage(): void {
        if (this.activeNum === 0) {
            this.activeNum = this.imgData.length-1; // 현재 첫번째 이미지일 경우 마지막 이미지 노출
        } else {
            this.activeNum--;
        }
    }

    private showNextImage(): void {
        if (this.activeNum+1 < this.imgData.length) {
            this.activeNum++;
        } else {
            this.activeNum = 0; // 현재 마지막 이미지일 경우 첫번째로 돌아감
        }
    }

    private closePhotoViewer(): void {
        //this.isPhotoViewer = false;
        this.$emit('change', false);
    }

}