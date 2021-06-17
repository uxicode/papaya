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


  public voteTitle: string = '';
  public type: number | string = '0';
  public voteList: any = [];


  @Post.Getter
  private voteItems!: IReadAbleVote;

  get readVoteData(): IVoteModel{
    const {anonymous_mode, finishAt, id, multi_choice, open_progress_level, open_result_level, parent_id, title, type, vote_choices}=this.voteItems;
    const vote_choice_list=vote_choices.map( (item)=>{
      const {text, index}=item;
      return {text, index};
    });
    this.voteData= {
      vote: {
        parent_id, type, title, multi_choice, anonymous_mode, open_progress_level, open_result_level, finishAt
      },
      vote_choice_list
    };
    console.log(this.voteData);

    return this.voteData;
  }

  public optionChange(value: number ): void {
    super.optionChange(value);
  }

}
