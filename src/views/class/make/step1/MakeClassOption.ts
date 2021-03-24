import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import {IMakeClassInfo, ISearchSchool} from '@/views/model/my-class.model';
import {Observable} from 'rxjs';
import WithRender from './MakeClassOption.html';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap, filter, tap
} from 'rxjs/operators';
import MyClassService from '@/api/service/MyClassService';


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

  private pageTitle: string = '클래스 분류 선택';
  private pageDesc: string = '클래스 분류를 선택해주세요.';
  private openPopupStatus: boolean = false;

  private activeItem: number=-1;
  private menuData: IMenuOption[]= [
    {id: 0, title: '학교', key: 'school', type:'type1'},
    {id: 1, title: '단체', key: 'organization', type:'type2'},
    {id: 2, title: '소모임', key: 'group', type:'type3'},
  ];

  //검색어 결과 모음 배열.
  private searchResultItems: ISearchSchool[]=[];
  private searchValue: string = '';
  private isSelected: boolean=false;
  private isLoading: boolean= false;

  @MyClass.Mutation
  private CREATE_CLASS_LIST!: (info: IMakeClassInfo) => void;


  get loadingStatus(): boolean{
    return this.isLoading;
  }
  get searchResultValue(): string{
    return this.searchValue;
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
    return !!this.searchResultValue && this.isSelected;
  }

  private search(){
    this.searchResultItems=[];

    //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
    this.$nextTick( ()=>{
      const keyup$: Observable<Event | void>=this.$fromDOMEvent('#searchSchool', 'keyup')
        .pipe(
          debounceTime(300),
          map((event: any) => event.target.value ), /*KeyboardEvent 로 전달되는 데이터를 입력된 검색어로 변환.*/
          distinctUntilChanged(), // 동일한 데이터가 계속 전달될 경우 이전과 다른 데이터가 전달되기 전까지 데이터를 전달하지 않는다. 즉 중복 데이터 처리
          filter( (value)=>{
            this.searchResultItems=[];
            return value.trim().length>0; //검색어 길이가 0 보다 큰경우 즉 검색어가 있을 경우에만
          }),
          tap( ()=> this.checkLoading() ),
          mergeMap( ( value: any) => {
            return MyClassService.getSearchSchool( value );
          }),
          tap( ()=> this.checkLoading() ),
        );
      keyup$.subscribe({
        next:( value: any ) =>{
          this.searchResultItems=value.results.map( ( item: any )=> item );
        },
      });
    });

  }

  private checkLoading(): void{
    this.isLoading=!this.isLoading;
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
    this.search();
    // this.currentStatus = status;
  }

  /**
   * 팝업 닫기
   * @private
   */
  private closeSchoolSearchPopup(): void{
    this.openPopupStatus=false;
  }

  private applySearchResult( name: string): void {
    this.closeSchoolSearchPopup();
    this.searchValue=name;
    this.isSelected=true;

    const schoolNameField=document.getElementById('schoolName') as HTMLInputElement;
    schoolNameField.value=this.searchValue;

    this.CREATE_CLASS_LIST({ g_type:1, g_name: this.searchValue });
  }

  private nextStepClickHandler(): void{
    this.$router.push('/make-class/step2');
  }
}

