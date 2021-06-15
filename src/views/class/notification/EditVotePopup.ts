import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import AddVotePopup from '@/views/class/notification/AddVotePopup';

import {IPostInLinkModel, IPostModel, IReadAbleVote, IVoteModel} from '@/views/model/post.model';
import draggable, {MoveEvent} from 'vuedraggable';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import RadioButton from '@/components/radio/RadioButton.vue';
import Modal from '@/components/modal/modal.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import WithRender from '@/views/class/notification/EditVotePopup.html';


const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    TxtField,
    Btn,
    RadioButton,
    Modal,
    ImagePreview,
    FilePreview,
    draggable
  }
})
export default class EditVotePopup extends AddVotePopup {

  @Prop(Object)
  public readVoteData!: IReadAbleVote;
  public voteTitle: string = '';
  public type: number | string = '0';
  public voteList: any = [];


  @Post.Getter
  private postDetailItem!: IPostModel & IPostInLinkModel;

  public updated() {
    this.voteTitle=this.readVoteData.title;
    this.type=this.readVoteData.type;
    this.voteList=this.readVoteData.vote_choices;

    console.log( this.readVoteData );
  }
}
