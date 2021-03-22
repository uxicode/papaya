import {Vue, Component} from 'vue-property-decorator';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';

import WithRender from './MakeClassOption.html';

interface IMenuOption{
  id: number;
  title: string;
  key: string;
  type: string;
}

@WithRender
@Component({
  components:{
    TxtField,
    Btn,
    Modal,
  }
})
export default class MakeClassOption extends Vue{

  private pageTitle: string = '클래스 분류 선택';
  private pageDesc: string = '클래스 분류를 선택해주세요.';
  private openPopupStatus: boolean = false;

  private activeItem: number=-1;
  private menuData: IMenuOption[]= [
    {id: 0, title: '학교', key: 'school', type:'type1'},
    {id: 1, title: '단체', key: 'organization', type:'type2'},
    {id: 2, title: '소모임', key: 'group', type:'type3'},
  ];

  get menuInfos(): IMenuOption[]{
    return this.menuData;
  }

  get isOpenPopup(): boolean{
    return this.openPopupStatus;
  }

  private menuClickHandler(idx: number): void{
    this.activeItem = idx;
  }

  private isActive(idx: number): boolean {
    return this.activeItem === idx;
  }

  private isSchoolSelected( idx: number ): boolean{
    return !!this.menuData[idx] && this.menuData[idx].key === 'school';
  }

  private isOrganization( idx: number ): boolean{
    return !!this.menuData[idx] && this.menuData[idx].key === 'organization';
  }

  /**
   * 팝업 열기
   * @param status
   * @private
   */
  private openSchoolSearchPopup(): void{
    this.openPopupStatus=true;
    // this.currentStatus = status;
  }

  /**
   * 팝업 닫기
   * @private
   */
  private closeSchoolSearchPopup(): void{
    this.openPopupStatus=false;
  }

}

