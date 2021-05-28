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
import WithRender from '@/views/class/notification/AddVotePopup.html';

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
    parent_id:0,
    type: '0',
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
  };
  private openResultLevel: string = '전체공개';
  private openResultLevelItems = [
    {id:0, txt:'전체 공개'},
    {id:1, txt:'운영자와 스텝에게만 공개'},
    {id:2, txt:'운영자에게만 공개'},
    ];
  private dateModelItem: Array<{ date: string }> = [
    {date: new Date().toISOString().substr(0, 10)},
    {date:''},
    {date:''},
  ];

  private anonymousChk: boolean=false;
  private multiChoiceChk: boolean=false;
  private endDateMenuChk: boolean=false;
  private endDateMenu: boolean=false;

  get isValidation(): boolean{
    const validItems=this.voteData.vote_choice_list.filter((item) => item.text !== '');
    const validDateItems=this.dateModelItem.filter((item) => item.date !== '');
    return this.voteData.title!=='' && ( validItems.length>=2 || validDateItems.length>=2);
  }

  get dragOptions() {
    return {
      animation: 200,
      group: 'description',
      disabled: !this.dragEnabled,
      ghostClass: 'ghost'
    };
  }

  private resetVoteList() {
    this.voteData.vote_choice_list=[
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
    ];

  }

  private addVoteList(idx: number) {
    this.updateVoteList(idx);
  }

  private addVoteDateList(idx: number) {
    this.updateVoteList(idx);
    this.dateModelItem.push({date: new Date().toISOString().substr(0, 10)});
    this.dateModelItem.forEach((item, index)=>{
      this.voteData.vote_choice_list[index].text=item.date;
    });

  }

  private updateVoteList(idx: number) {
    this.voteData.vote_choice_list.push({
      text: '',
      index: ++idx
    });
  }

  private popupChange( value: boolean ) {
    this.$emit('close', value);
  }

  private optionChange(value: number ): void {
    this.resetVoteList();
    this.voteData.type=value;
  }

  private checkMove(e: MoveEvent<any> ) {
    window.console.log('Future index: ' + e.draggedContext.futureIndex);
  }

  private clearTxtField(idx: number) {
    this.voteData.vote_choice_list[idx].text = '';
  }

  private anonymousVoteChange(value: string | boolean) {
    this.anonymousChk=!!value;
    this.voteData.anonymous_mode=( this.anonymousChk )? 1 : 0;
  }

  private multiChoiceVoteChange(value: string | boolean) {
    this.multiChoiceChk=!!value;
    this.voteData.multi_choice=( this.multiChoiceChk )? 1 : 0;
  }

  private endDatePickerChange() {
    this.endDateMenu=false;
  }

  private endDateVoteChange(value: string | boolean) {
    this.endDateMenuChk=!!value;
    this.voteData.finishAt=( this.endDateMenuChk )? new Date().toISOString().substr(0, 10) : null;
  }

  private onVoteSubmit() {
    this.$emit('submit', this.voteData);
  }



}
