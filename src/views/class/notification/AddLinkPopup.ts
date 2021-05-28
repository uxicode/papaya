import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import draggable, {MoveEvent} from 'vuedraggable';
import {ILinkModel} from '@/views/model/post.model';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from '@/views/class/notification/AddLinkPopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components: {
    draggable,
    Modal,
    TxtField
  }
})
export default class AddLinkPopup extends Vue {
  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;

  private dragEnabled: boolean = true;
  private dragging: boolean = false;

  private linkData: ILinkModel = {
    link: {
      title: '',
    },
    link_item_list: [
      {
        index: 0,
        url: ''
      }
    ]
  };

  get dragOptions() {
    return {
      animation: 200,
      group: 'description',
      disabled: !this.dragEnabled,
      ghostClass: 'ghost'
    };
  }

  get isValidation(): boolean{
    const validURLRegx = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const invalidLinkItems = this.linkData.link_item_list.filter( (item: {index: number, url: string} ) => validURLRegx.test(item.url) );
    return invalidLinkItems.length > 0;
  }

  private popupChange( value: boolean ) {
    this.$emit('close', value);
  }
  private checkMove(e: MoveEvent<any> ) {
    window.console.log('Future index: ' + e.draggedContext.futureIndex);
  }

  private addLinkList(idx: number) {
    this.linkData.link_item_list.push({
      url: '',
      index: ++idx
    });
  }

  private clearTxtField(idx: number) {
    this.linkData.link_item_list[idx].url = '';
  }

  private onAddLinkSubmit() {
    this.$emit('submit', this.linkData);
  }

}
