import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import {IMakeClassInfo, ISearchSchool} from '@/views/model/my-class.model';
import WithRender from './MakeClassOption.html';
import MyClassService from '@/api/service/MyClassService';
import { searchUserKeyValueObservable, resetSearchInput, searchKeyEventObservable} from '@/views/service/search/SearchService';


const MyClass = namespace('MyClass');

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

  private activeItem: number=-1;
  private openPopupStatus: boolean = false;
  private searchSchoolValue: string = '';
  private groupNameValue: string = '';
  private isLoading: boolean= false;
  private isManualClick: boolean=false;
  private manualInputField: string = '';
  private pageDesc: string = '클래스 분류를 선택해주세요.';
  private pageTitle: string = '클래스 분류 선택';
  private menuData: IMenuOption[]= [
    {id: 0, title: '학교', key: 'school', type:'type1'},
    {id: 1, title: '단체', key: 'organization', type:'type2'},
    {id: 2, title: '소모임', key: 'group', type:'type3'},
  ];
  //검색어 결과 모음 배열.
  private searchResultItems: ISearchSchool[]=[];

  @MyClass.Mutation
  private CREATE_CLASS_LIST!: (info: IMakeClassInfo) => void;

  get searchResultValue(): string{
    return this.searchSchoolValue;
  }
  get searchResults(): ISearchSchool[] {
    return this.searchResultItems;
  }
  get menuInfos(): IMenuOption[]{
    return this.menuData;
  }

  get isOpenPopup(): boolean{
    return this.openPopupStatus;
  }
  get isNextStep(): boolean{
    return !!this.searchResultValue || !!this.manualInputField || !!this.groupNameValue || this.activeItem ===2;
  }
  get manualChk(): boolean{
    return this.isManualClick;
  }

  get loadingModel() {
    return this.isLoading;
  }

  public getSchoolNameInput( selector: string ): HTMLInputElement{
    return document.getElementById( selector ) as HTMLInputElement;
  }

  private search(){
    this.searchSchoolValue='';
    this.searchResultItems=[];

    //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
    this.$nextTick( ()=>{

      //키가 눌렸을 때 체크 Observable
      // targetInputSelector: string
      const keyup$ = searchKeyEventObservable('#searchSchool');

      //사용자가 입력한 값 처리 Observable
      //obv$: Observable<any>, loadChk: ()=>void, promiseFunc: Promise<any>, isLoading: boolean
      const userInter$ = searchUserKeyValueObservable(keyup$, this.checkLoading, MyClassService.getSearchSchool, this.isLoading );
      userInter$.subscribe({
        next:( searchData: any ) =>{
          // console.log(searchData);
          /*
            message: "리스트 ....."
            result_count: 2
            results: (2) [{…}, {…}]
            total: 2
          */
          this.searchResultItems=searchData.results.map( ( item: any )=> item );
        },
      });

      //검색어 없을 시 리셋 Observable
      //obv$: Observable<any>, reset: ()=>void
      const reset$ = resetSearchInput(keyup$, ()=>{
        this.isLoading=false;
        this.searchResultItems = [];
      });
      reset$.subscribe();
    });
  }

  /**
   * 검색어와 매칭되는 키워드만 볼드 처리
   * @param word
   * @private
   */
  private boldSearchResult( word: string): string{
    const startIndex=word.indexOf(this.searchResultValue);
    const endIndex=startIndex+this.searchResultValue.length;
    const searchResultWord=word.substr(startIndex, this.searchResultValue.length);
    return [word.slice(0, startIndex), `<strong>${searchResultWord}</strong>`, word.slice(endIndex, word.length)].join('');
  }

  /**
   * 로딩바 체크 toggle
   * @private
   */
  private checkLoading(): void{
    this.isLoading=!this.isLoading;
  }

  private menuClickHandler(idx: number): void{
    this.activeItem = idx;
  }

  private isActive(idx: number): boolean {
    return this.activeItem === idx;
  }

  /**
   * 현재 학교를 선택했는지 체크
   * @param idx
   * @private
   */
  private isSchoolSelected( idx: number ): boolean{
    return !!this.menuData[idx] && this.menuData[idx].key === 'school';
  }

  /**
   * 현재 단체를 선택했는지 체크
   * @param idx
   * @private
   */
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
    this.search();
    // this.currentStatus = status;
  }

  /**
   * 팝업 닫기
   * @private
   */
  private closeSchoolSearchPopup(): void{
    this.openPopupStatus=false;
    this.isManualClick=false;
  }

  private manualInputClickHandler(): void{
    this.isManualClick=true;
  }

  /**
   * 직접입력 -> 확인 버튼 클릭시
   * @private
   */
  private applyManualValClickHandler(): void{
    this.changeSchoolNameValue(this.manualInputField);
    this.closeSchoolSearchPopup();
  }

  /**
   * autocomplete 로 검색된 리스트 중 하나를 클릭했을때 실행 -> 해당 클릭한 키워드값으로
   * @param name
   * @private
   */
  private applySearchResult( name: string): void {
    this.closeSchoolSearchPopup();
    this.searchSchoolValue=name;
    this.changeSchoolNameValue(this.searchSchoolValue);
  }

  /**
   * 학교 이름 input  value 변경
   * @param val
   * @private
   */
  private changeSchoolNameValue(val: string) {
    const schoolNameField=this.getSchoolNameInput('schoolName');
    schoolNameField.value = val;
  }

  /**
   * 1단계에서 다음 버튼 클릭시 -> 2단계로 진행 알림.
   * @private
   */
  private nextStepClickHandler(): void{
    this.classOptionSelect();
    this.$router.push('/make-class/step2');
    this.$emit('updateStep', 2);
  }

  /**
   *  step1 상태에서 다음 버튼 클릭시 -> 학교 / 단체 / 소모임 중에 어떤 것을 선택했는 지 상태를 알려줌.
   * @private
   */
  private classOptionSelect() {
    switch(this.activeItem){
      case 0 :
        this.CREATE_CLASS_LIST({ g_type:1, g_name: this.searchSchoolValue });
        break;
      case 1 :
        this.CREATE_CLASS_LIST({ g_type:2, g_name: this.groupNameValue });
        break;
      case 2:
        this.CREATE_CLASS_LIST({ g_type:3, g_name: '소모임' });
        break;
    }
  }





}

