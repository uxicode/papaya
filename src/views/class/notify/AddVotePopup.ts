import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IVoteModel} from '@/views/model/post.model';
import draggable, {MoveEvent} from 'vuedraggable';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import RadioButton from '@/components/radio/RadioButton.vue';
import Modal from '@/components/modal/modal.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import WithRender from '@/views/class/notify/AddVotePopup.html';

const MyClass = namespace('MyClass');

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
export default class AddVotePopup extends Vue{
  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;
  private dragEnabled: boolean=true;
  private dragging: boolean= false;
  private voteData: IVoteModel= {
    vote:{
      type: 0,
      title: '',
      multi_choice: 0,
      anonymous_mode: 0,
      open_progress_level: 0,
      open_result_level: 0,
      finishAt: new Date().toISOString().substr(0, 10),
      vote_choice_list: [
        {
          text: '제주도 여행',
          index: 1
        },
        {
          text: '',
          index: 2
        },
        {
          text: '',
          index: 3
        }
      ]
    }
  };
  private openResultLevel: string = '전체공개';
  private openResultLevelItems = [
    {id:0, txt:'전체 공개'},
    {id:1, txt:'운영자와 스텝에게만 공개'},
    {id:2, txt:'운영자에게만 공개'},
    ];
  private anonymousChk: boolean=false;
  private multiChoiceChk: boolean=false;
  private endDateMenu: boolean=false;

  get dragOptions() {
    return {
      animation: 200,
      group: 'description',
      disabled: !this.dragEnabled,
      ghostClass: 'ghost'
    };
  }

  private addVoteList(idx: number) {
    this.voteData.vote.vote_choice_list.push({
      text: '',
      index: ++idx
    });
  }

  private popupChange( value: boolean ) {
    this.$emit('close', value);
  }

  private optionChange(value: number ): void {
    this.voteData.vote.type=value;
  }

  private checkMove(e: MoveEvent<any> ) {
    window.console.log("Future index: " + e.draggedContext.futureIndex);
  }

  private anonymousVoteChange(value: string | boolean) {
    this.anonymousChk=!!value;
    this.voteData.vote.anonymous_mode=( this.anonymousChk )? 1 : 0;
  }

  private multiChoiceVoteChange(value: string | boolean) {
    this.multiChoiceChk=!!value;
    this.voteData.vote.multi_choice=( this.multiChoiceChk )? 1 : 0;
  }

  private endDatePickerChange() {
    this.endDateMenu=false;
  }

}
