import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import {IMakeClassInfo, ISearchSchool} from '@/views/model/my-class.model';
import {Observable} from 'rxjs';
import WithRender from './MakeClassOption.html';
import {debounceTime, distinctUntilChanged, filter, finalize, map, retry, share, switchMap, tap} from 'rxjs/operators';
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
  private searchSchoolValue: string = '';
  private groupNameValue: string = '';
  private isLoading: boolean= false;
  private isManualClick: boolean=false;
  private manualInputField: string = '';

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

  public getSchoolNameInput( selector: string ): HTMLInputElement{
    return document.getElementById( selector ) as HTMLInputElement;
  }

  private search(){
    this.searchSchoolValue='';
    this.searchResultItems=[];

    //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
    this.$nextTick( ()=>{
      const keyup$: Observable<Event>=this.$fromDOMEvent('#searchSchool', 'keyup')
        .pipe(
          debounceTime(300),
          map((event: any) => event.target.value ), /*KeyboardEvent 로 전달되는 데이터를 입력된 검색어로 변환.*/
          distinctUntilChanged(), // 동일한 데이터가 계속 전달될 경우 이전과 다른 데이터가 전달되기 전까지 데이터를 전달하지 않는다. 즉 중복 데이터 처리
          share()
        );

      const user$= keyup$
        .pipe(
          filter( ( value: any)=> value.trim().length>1), //검색어 길이가 0 보다 큰경우 즉 검색어가 있을 경우에만,
          tap( ()=> this.checkLoading() ),
          switchMap( ( value: any) => {
            //빈번하게 발생하는 데이터를 처리하는 경우 mergeMap 보다는 switchMap 이 더욱 효과적.
            //switchMap 은 기존에 존재하던 Observable 의 구독을 자동으로 해제함으로써 불피료한 데이터를 부르지 않는다.
            // 또한 이미 처리했던 Observable 을 자동으로 unsubscribe 하기 때문에 메모리 누수 문제에 대해서도 자유롭다.
            return MyClassService.getSearchSchool( value );
          }),
          tap( ()=> this.checkLoading() ),
          retry(2),  // 검색어가 입력되어 2번의 오류가 발생하면 Observer.error 이 호출되어 keyup$ Observable 의  구독이 해제된다.
          finalize( ()=>this.isLoading=false )
        );

      user$.subscribe({
        next:( value: any ) =>{
          this.searchResultItems=value.results.map( ( item: any )=> item );
        },
      });

      const reset$ = keyup$
        .pipe(
          filter((value: any) => value.trim().length === 0),
          tap((value) => {
            this.isLoading=false;
            this.searchResultItems = [];
          }) // 검색어 입력이 없을시 이전 검색결과 없앤다.
        ).subscribe();

    });

  }

  private boldSearchResult( word: string): string{
    // console.log(word.indexOf(this.searchResultValue) );

    const startIndex=word.indexOf(this.searchResultValue);
    const endIndex=startIndex+this.searchResultValue.length;
    const searchResultWord=word.substr(startIndex, this.searchResultValue.length);

    return [word.slice(0, startIndex), `<strong>${searchResultWord}</strong>`, word.slice(endIndex, word.length)].join('');
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
    this.isManualClick=false;
  }

  private manualInputClickHandler(): void{
    this.isManualClick=true;
  }

  private applyManualValClickHandler(): void{
    const schoolNameField=this.getSchoolNameInput('schoolName');
    schoolNameField.value=this.manualInputField;
    this.closeSchoolSearchPopup();
  }



  private applySearchResult( name: string): void {
    this.closeSchoolSearchPopup();
    this.searchSchoolValue=name;

    const schoolNameField=this.getSchoolNameInput('schoolName');
    schoolNameField.value=this.searchSchoolValue;
  }

  private nextStepClickHandler(): void{
    this.classOptionSelect();
    this.$router.push('/make-class/step2');
    this.$emit('updateStep', 2);
  }

  private classOptionSelect() {

    switch(this.activeItem){
      case 0 :
        this.CREATE_CLASS_LIST({ g_type:1, g_name: this.searchSchoolValue });
        break;
      case 1 :
        this.CREATE_CLASS_LIST({ g_type:2, g_name: this.groupNameValue });
        break;
      case 2:
        console.log(this.activeItem);
        this.CREATE_CLASS_LIST({ g_type:3, g_name: '소모임' });
        break;
    }
  }





}

