import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import draggable, {MoveEvent} from 'vuedraggable';
import {ILinkModel} from '@/views/model/post.model';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from '@/views/class/notification/AddLinkPopup.html';
import {Utils} from '@/utils/utils';

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

  get isValidation(): boolean{
    const validLinkItems = this.linkData.link_item_list.filter( (item: {index: number, url: string} ) =>item.url!=='' );
    return (this.linkData.link.title !== '' && validLinkItems.length >= 1);
  }

  public getValidLinkItems(): Array<{ index: number, url: string }>{
    const invalidLinkItems: Array<{ index: number, url: string }> = [];
    this.linkData.link_item_list.forEach( (item: { index: number, url: string } )=>{
      //유효하지 않은 url 찾기
      if( item.url!=='' && !Utils.getIsValidLink(item.url)  ){
        invalidLinkItems.push(item);
      }
    });
    return invalidLinkItems;
  }

  private resetLinkData() {
    this.linkData= {
      link: {title: ''},
      link_item_list: [{index: 0, url: ''}]
    };
  }
  private popupChange( value: boolean ) {
    this.$emit('close', value);
    if (!value) {
      this.resetLinkData();
    }
  }
  private checkMove(e: MoveEvent<any> ) {
    console.log('Future index: ' + e.draggedContext.futureIndex, e.draggedContext.index, e.draggedContext.element );
  }

  private onDragStart() {
    this.dragging = true;
  }

  private onDragEnd(e: MouseEvent) {
    this.dragging = false;
    this.linkData.link_item_list.forEach((item, idx) => {
      item.index = idx;
    });
    // console.log(this.linkData.link_item_list);
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
    const inputItems: NodeListOf<Element> = document.querySelectorAll('.form-control.link-input');
    //inputItems 은 유사배열 객체이기에 아래처럼 배열로 변환해 준다.
    const inputItemsToArray: any[]= Array.prototype.slice.call(inputItems);
    const eles = [];
    //유효하지 않은 링크가 있을때
    if( this.getValidLinkItems().length>0 ){
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.getValidLinkItems().length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j< inputItemsToArray.length;j++) {
          const itemIdx = Number( inputItemsToArray[j].getAttribute('data-index') );
          if (itemIdx === this.getValidLinkItems()[i].index) {
            eles.push(inputItemsToArray[j]);
          }
        }
      }
      eles.forEach((item)=>{
        this.gotoErrorElement( item);
      });
    }else{
      //공백인 항목 제거
      this.removeToEmpty();

      //http 없는 url 에 추가해 주기
      this.addToURLHttp();

      // console.log(this.linkData.link_item_list);
      this.$emit('submit', this.linkData);
    }

  }


  private addToURLHttp() {
    this.linkData.link_item_list.forEach((item, index)=>{
      if( item.url.indexOf('http')===-1){
        const url='http://'+item.url;
        // console.log(item.url, index, {...this.linkData.link_item_list[index], ...{ url } } );
        this.linkData.link_item_list.splice(index, 1, {...this.linkData.link_item_list[index], ...{ url } });
      }
    });
  }

  private removeToEmpty() {
    this.linkData.link_item_list.forEach((item, index)=>{
      if( item.url===''){
        this.linkData.link_item_list.splice(index, 1);
        // console.log(item.url, index );
      }
    });
  }

  private gotoErrorElement( ele: HTMLInputElement ): void {
    // const inputEle=document.getElementById(selector) as HTMLInputElement;
    ele.classList.add('error');
    ele.classList.add('shake');

    //애니메이션이 종료되는 시점에 등록된 shake 클래스를 제거.
    ele.addEventListener('animationend', (e: AnimationEvent ) =>{
      setTimeout(() => {
        ele.classList.remove('shake');
        ele.classList.remove('error');
      }, 800);

      ele.focus();
      ele.blur();
    }, {once: true});
  }

}
