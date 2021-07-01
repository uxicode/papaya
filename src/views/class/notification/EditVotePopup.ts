import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

import {IReadAbleVote, IVoteModel} from '@/views/model/post.model';
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
export default class EditVotePopup extends Vue {


  public voteTitle: string = '';
  public type: number | string = '0';
  public voteList: any = [];

  @Prop(Boolean)
  private isOpen!: boolean;

  private anonymousChk: boolean=false;
  private multiChoiceChk: boolean=false;
  private endDateMenuChk: boolean=false;
  private endDateMenu: boolean=false;
  private dragEnabled: boolean=true;
  private dragging: boolean= false;
  private voteType: string = 'txt';
  private openResultLevel: string = '전체공개';
  private openResultLevelItems = [
    {id:0, txt:'전체 공개'},
    {id:1, txt:'운영자와 스텝에게만 공개'},
    {id:2, txt:'운영자에게만 공개'},
  ];
  private dateModelItem: Array<{ text: string, index: number }> = [
    {text: new Date().toISOString().substr(0, 10), index:1},
    {text:'', index:2},
    {text:'', index:3},
  ];
  private txtModelItem: Array<{ text: string, index: number; }> = [
    {text: '제주도 여행', index: 1},
    {text: '', index: 2},
    {text: '', index: 3}
  ];
  private voteData: IVoteModel= {
    vote: {
      parent_id:-1,
      type: 0,
      title: 'none',
      multi_choice: 0,
      anonymous_mode: 0,
      open_progress_level: 0,
      open_result_level: 0,
      finishAt: new Date().toISOString().substr(0, 10),
    },
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

  @Post.Getter
  private voteItems!: IReadAbleVote;

  @MyClass.Getter
  private classID!: string | number;

  get readVoteData(): IVoteModel{
    this.resetData();
    // console.log(this.voteData);
    return this.voteData;
  }

  get isValidation(): boolean{
    const validItems=this.voteData.vote_choice_list.filter((item) => item.text !== '');
    const validDateItems=this.dateModelItem.filter((item) => item.text !== '');
    return this.voteData.vote.title!=='' && ( validItems.length>=2 || validDateItems.length>=2);
  }

  get dragOptions() {
    return {
      animation: 200,
      group: 'description',
      disabled: !this.dragEnabled,
      ghostClass: 'ghost'
    };
  }
  get currentType(): boolean {
    // console.log('voteType=', this.voteType);
    return this.voteType === 'txt';
  }

  public resetData() {
    if (this.voteItems !== null) {
      const {
        anonymous_mode,
        finishAt,
        id,
        multi_choice,
        open_progress_level,
        open_result_level,
        parent_id,
        title,
        type,
        vote_choices
      } = this.voteItems;

      //투표
      this.voteType=( type===0 )? 'txt' : 'date';

      // tslint:disable-next-line:variable-name
      const vote_choice_list=vote_choices.map( (item)=>{
        const {text, index}=item;
        return {text, index};
      });

      this.voteData= {
        vote: {
          parent_id,
          type,
          title,
          multi_choice,
          anonymous_mode,
          open_progress_level,
          open_result_level,
          finishAt
        },
        vote_choice_list
      };
    }

  }

  public readDataTo() {
    this.voteData.vote_choice_list=this.voteItems.vote_choices.map((item) => {
      const {text, index} = item;
      return {text, index};
    });
  }


  public resetVoteList() {
    // const firstPlaceholder = (this.voteData.vote.type === 0) ? '제주도 여행' : new Date().toISOString().substr(0, 10);
    // console.log(this.voteData.vote.type);

    if (this.voteItems.vote_choices.length) {
      console.log(this.voteData.vote.type, this.voteType);

      if(this.voteData.vote.type === 0 && this.voteType==='date') {
        this.voteData.vote_choice_list = this.dateModelItem;
      }else if(this.voteData.vote.type === 1 && this.voteType==='txt') {
        this.voteData.vote_choice_list = this.txtModelItem;
      }else{
        this.readDataTo();
      }
    }
  }

  public editCancel() {
    this.resetData();
    this.voteData.vote_choice_list=this.voteItems.vote_choices.map((item) => {
      const {text, index} = item;
      return {text, index};
    });
    this.popupChange(false);
}

  public optionChange(value: string ): void {
    this.voteType=value;
    // console.log(value);
    this.resetVoteList();
  }

  private addVoteList(idx: number) {
    this.updateVoteList(idx);
  }

  private addVoteDateList(idx: number) {
    this.voteData.vote_choice_list.push({text: new Date().toISOString().substr(0, 10), index: idx});
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

  private checkMove(e: MoveEvent<any> ) {
    window.console.log('Future index: ' + e.draggedContext.futureIndex);
  }

  private onDragStart() {
    this.dragging = true;
  }

  private onDragEnd() {
    this.dragging = false;
    this.voteData.vote_choice_list.forEach((item, idx) => {
      item.index = idx;
    });
    // console.log(this.linkData.link_item_list);
  }

  private clearTxtField(idx: number) {
    this.voteData.vote_choice_list[idx].text = '';
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

  private endDateVoteChange(value: string | boolean) {
    this.endDateMenuChk=!!value;
    this.voteData.vote.finishAt=( this.endDateMenuChk )? new Date().toISOString().substr(0, 10) : null;
  }

  private onVoteSubmit() {
    this.voteData.vote.type=(this.voteType==='txt')? 0 : 1;
    this.$emit('submit', this.voteData);
  }


}
